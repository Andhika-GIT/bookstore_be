import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { CreateCartDto, CartResponseDto } from './dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart_item.entity';
import { BookService } from '@/book/book.service';
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
      book_id: item?.book?.id,
      img_url: item?.book?.img_url,
      title: item?.book?.title,
      quantity: item?.quantity,
    }));

    return {
      cart_id: cart?.id,
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
        populate: [],
      },
    );

    return cartItems;
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

      await this.em.persistAndFlush(currentCart);
    }

    const bookQuantity = await this.bookservice.getBookQuantity(
      reqItems?.book_id,
    );

    // check if cart_item already exist
    const existingCartItem = currentCart?.items
      ?.getItems()
      .find((item) => item?.book?.id === reqItems?.book_id);

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
}
