import { Book } from '@/book/entities/book.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { handleFindOrFail } from '@/common/utils/handleFindOrFail';
import { CreateBookDto } from './dto/create-book';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: EntityRepository<Book>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly em: EntityManager, // Inject the EntityManager
  ) {}

  async findAll(page: number = 1): Promise<Book[]> {
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    return this.bookRepository.findAll({ limit: pageSize, offset: offset });
  }

  async findOne(id: number): Promise<Book> {
    return handleFindOrFail(this.bookRepository, { id });
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
}
