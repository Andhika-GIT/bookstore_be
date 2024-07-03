import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: EntityRepository<Book>,
  ) {}

  async findAll(page: number = 1): Promise<Book[]> {
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    return this.bookRepository.findAll({ limit: pageSize, offset: offset });
  }

  async findOne(id: number): Promise<Book> {
    return this.bookRepository.findOne({ id: id });
  }
}
