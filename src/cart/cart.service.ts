import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { CreateCartDto, CartResponseDto } from './dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart_item.entity';
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: EntityRepository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: EntityRepository<CartItem>,
    private readonly em: EntityManager,
  ) {}

  async findAllCart(user_id: number): Promise<Cart[] | undefined[]> {
    return this.cartRepository.find(
      { user_id: user_id },
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
        user_id: user_id,
      },
      {
        populate: ['items.book_id'],
      },
    );

    if (!cart) {
      return [];
    }

    // generate all cart items from cart
    const cartItems = cart.items.getItems();

    const items = cartItems?.map((item) => ({
      book_id: item?.book_id?.id,
      img_url: item?.book_id?.img_url,
      title: item?.book_id?.title,
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
        cart_id: cart_id,
      },
      {
        populate: ['book_id'],
      },
    );

    return cartItems;
  }

  async createCart(reqItems: CreateCartDto) {
    let currentCart = await this.cartRepository.findOne({
      user_id: reqItems?.user_id,
    });

    if (!currentCart) {
      currentCart = this.cartRepository.create({
        user_id: reqItems?.user_id,
      });
    }

    const cartITem = this.cartItemRepository.create({
      cart_id: currentCart,
      book_id: reqItems?.book_id,
      quantity: reqItems?.quantity,
    });

    await this.em.persistAndFlush(currentCart);
    await this.em.persistAndFlush(cartITem);
  }
}
