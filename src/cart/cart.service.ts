import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { CreateCartDto, CartResponseDto } from './dto';
import { Cart } from './entities/cart.entity';
import { User } from '@/user/entities/user.entity';
import { CartItem } from './entities/cart_item.entity';
import { BookService } from '@/book/book.service';
import { handleFindOrFail } from '@/common/utils/handleFindOrFail';
@Injectable()
export class CartService {
  constructor(
    private readonly bookservice: BookService,
    private readonly em: EntityManager,
    @InjectRepository(Cart)
    private readonly cartRepository: EntityRepository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: EntityRepository<CartItem>,
  ) {}

  private calculateTotalPrice(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.book.price;
    }, 0);
  }

  async findAllCart(user_id: number): Promise<Cart[] | undefined[]> {
    return this.cartRepository.find(
      { user: user_id },
      {
        populate: ['items'],
      },
    );
  }

  async findAllCartItemsByUserId(
    user_id: number,
  ): Promise<CartResponseDto | undefined[]> {
    const cart = await this.cartRepository.findOne(
      {
        user: user_id,
      },
      {
        populate: ['items.book'],
      },
    );

    if (!cart) {
      return [];
    }

    // generate all cart items from cart
    const cartItems = cart.items.getItems();

    const items = cartItems?.map((item) => ({
      cart_items_id: item?.id,
      book_id: item?.book?.id,
      img_url: item?.book?.img_url,
      title: item?.book?.title,
      quantity: item?.quantity,
      book_quantity: item?.book?.quantity,
      price: item?.book?.price,
    }));

    const totalPrice = this.calculateTotalPrice(cartItems);

    return {
      cart_id: cart?.id,
      total_price: totalPrice,
      total_items: items?.length,
      items: items,
    };
  }

  async findAllCartItemsByCartId(
    cart_id: number,
  ): Promise<CartItem[] | undefined[]> {
    const cartItems = await this.cartItemRepository.find(
      {
        cart: cart_id,
      },
      {
        populate: ['book'],
      },
    );

    return cartItems;
  }

  async findCartItemByProductId(book_id: number): Promise<CartItem> {
    return await this.cartItemRepository.findOneOrFail({
      book: book_id,
    });
  }

  async findCartItemsById(id: number): Promise<CartItem> {
    return handleFindOrFail(this.cartItemRepository, { id }, [
      'cart',
      'cart.items',
      'book',
    ] as never[]);
  }

  async createCart(reqItems: CreateCartDto) {
    let currentCart = (await this.cartRepository.findOne(
      { user: reqItems?.user_id },
      { populate: ['items.book'] },
    )) as Cart;

    // if there's no cart, create new one
    if (!currentCart) {
      currentCart = this.cartRepository.create({
        user: reqItems?.user_id,
      });
      CartItem;

      await this.em.persistAndFlush(currentCart);
    }

    const currentCartItems = currentCart.items.getItems();

    // Check if the cart already has 10 or more items
    if (currentCartItems.length >= 10) {
      throw new BadRequestException(
        'Cart is full. Please remove at least one item before adding new items.',
      );
    }

    const bookQuantity = await this.bookservice.getBookQuantity(
      reqItems?.book_id,
    );

    // check if cart_item already exist
    const existingCartItem = currentCartItems?.find(
      (item) => item?.book?.id === reqItems?.book_id,
    );

    // if cart item already exist, then update the quantity
    if (existingCartItem) {
      // new quantity = request client quantity + existing cart item quantity
      const newQuantity = reqItems?.quantity + existingCartItem?.quantity;

      // if new quantity greater than book quantity from db, then throw bad request to client
      if (newQuantity > bookQuantity) {
        throw new BadRequestException(
          'requested quantity exceeds available stock',
        );
      }

      // update cart item repository with new quantity
      existingCartItem.quantity = newQuantity;
      await this.em.persistAndFlush(existingCartItem);
    }
    // if cart item not exist yet, create new cart item
    else {
      // if request quantity from client greater than book quantity from db, throw bad request to client
      if (reqItems?.quantity > bookQuantity) {
        throw new BadRequestException(
          'requested quantity exceeds available stock',
        );
      }

      // create new cart_item data
      const newCartItem = this.cartItemRepository.create({
        cart: currentCart,
        book: reqItems?.book_id,
        quantity: reqItems?.quantity,
      });

      await this.em.persistAndFlush(newCartItem);
    }
  }

  async increaseCartItemQuantity(cartItem: CartItem, requestQuantity: number) {
    const book = cartItem.book;

    const newQuantity = cartItem.quantity + requestQuantity;

    if (newQuantity > book.quantity) {
      throw new BadRequestException(
        'requested quantity exceeds available stock',
      );
    }

    cartItem.quantity += requestQuantity;
    await this.em.persistAndFlush(cartItem);
  }

  async decreaseCartItemQuantity(cartItem: CartItem) {
    const cart = cartItem.cart;

    await this.em.transactional(async (em) => {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await em.persistAndFlush(cartItem);
      } else {
        cart.items.remove(cartItem);
        await em.persistAndFlush(cart);
      }
    });
  }

  async deleteCartItem(cartItem: CartItem) {
    const cart = cartItem.cart;

    await this.em.transactional(async (em) => {
      cart.items.remove(cartItem);
      await em.persistAndFlush(cart);
    });
  }

  async clearCart(user: User) {
    const cart = await this.cartRepository.findOne(
      {
        user: user.id,
      },
      {
        populate: ['items'],
      },
    );

    if (cart) {
      cart.items.removeAll();
      await this.em.persistAndFlush(cart);

      await this.em.removeAndFlush(cart);
    }
  }
}
