import { Book } from '@/book/entities/book.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { handleFindOrFail } from '@/common/utils/handleFindOrFail';
import { CreateBookDto } from './dto/create-book';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { OrderItem } from '@/order/entities/order_item';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: EntityRepository<Book>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly em: EntityManager,
  ) {}

  async findAll(
    page: number = 1,
    filter?: string,
    query?: string,
  ): Promise<{ books: Book[]; nextPage: number }> {
    const pageSize = 8;
    const offset = (page - 1) * pageSize;

    // Handle query if provided
    let books: Book[];
    let totalBooks: number;
    let orderBy = {};

    // order by condition based on filter param
    if (filter === 'latest') {
      orderBy = { created_at: 'DESC' };
    } else if (filter === 'popular') {
      orderBy = { rating: 'DESC' };
    }

    if (query) {
      books = await this.bookRepository.find(
        { title: { $ilike: `%${query}%` } },
        { limit: pageSize, offset: offset, orderBy },
      );
      totalBooks = await this.bookRepository.count({
        title: { $ilike: `%${query}%` },
      });
    } else {
      books = await this.bookRepository.findAll({
        limit: pageSize,
        offset: offset,
        orderBy,
      });
      totalBooks = await this.bookRepository.count();
    }

    const totalPage = Math.ceil(totalBooks / pageSize);
    const nextPage = page < totalPage ? page + 1 : null;

    return { books, nextPage };
  }

  async findOne(id: number): Promise<Book> {
    return handleFindOrFail(this.bookRepository, { id });
  }

  async findAllByIds(
    ids: number[],
    pageSize: number,
    page: number,
    filter?: string,
    query?: string,
  ): Promise<{
    books: Book[];
    nextPage: number;
  }> {
    const offset = (page - 1) * pageSize;

    let books: Book[];
    let totalBooks: number;
    let orderBy = {};

    // order by condition based on filter param
    if (filter === 'latest') {
      orderBy = { created_at: 'DESC' };
    } else if (filter === 'popular') {
      orderBy = { rating: 'DESC' };
    }

    if (query) {
      // If query is provided, perform search with query parameter
      books = await this.bookRepository.find(
        {
          id: { $in: ids },
          title: { $ilike: `%${query}%` },
        },
        { limit: pageSize, offset: offset, orderBy },
      );
      totalBooks = await this.bookRepository.count({
        id: { $in: ids },
        title: { $ilike: `%${query}%` },
      });
    } else {
      // If no query is provided, return books based on IDs only
      books = await this.bookRepository.find(
        { id: { $in: ids } },
        { limit: pageSize, offset: offset, orderBy },
      );
      totalBooks = ids.length;
    }

    const totalPage = Math.ceil(totalBooks / pageSize);
    const nextPage = page < totalPage ? page + 1 : null;

    return { books, nextPage };
  }

  async getBookQuantity(id: number): Promise<number> {
    const book = await handleFindOrFail(this.bookRepository, { id });
    return book?.quantity;
  }
  async createBook(
    book: CreateBookDto,
    file: Express.Multer.File,
  ): Promise<Book> {
    try {
      let imageURL = '';

      if (file) {
        const publicId = await this.cloudinaryService.uploadImage(file);

        this.cloudinaryService.generateOptimizedUrl(publicId);
        const transformedUrl =
          this.cloudinaryService.generatedTransformtedUrl(publicId);

        imageURL = transformedUrl;
      }

      const newBook = this.bookRepository.create({
        ...book,
        img_url: imageURL,
      });

      await this.em.persistAndFlush(newBook);

      return newBook;
    } catch (e) {
      throw new Error(`Failed to create book: ${e.message}`);
    }
  }

  // quantities
  async reduceBookQuantity(orderItems: OrderItem[]): Promise<void> {
    for (const item of orderItems) {
      const book = await this.findOne(item.book.id);

      if (book.quantity >= item.quantity) {
        book.quantity -= item.quantity;
        await this.em.persistAndFlush(book);
      } else {
        throw new Error(`Insufficient quantity for book ID: ${book.id}`);
      }
    }
  }

  async restoreBookQuantity(orderItems: OrderItem[]): Promise<void> {
    for (const item of orderItems) {
      const book = await this.findOne(item.book.id);

      book.quantity += item.quantity;
      await this.em.persistAndFlush(book);
    }
  }
}
