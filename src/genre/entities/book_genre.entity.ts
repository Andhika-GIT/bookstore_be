import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { Genre } from './genre.entity';
import { Book } from '@/book/entities/book.entity';

@Entity()
export class BookGenre {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => Book, { primary: true })
  book!: Book; // Relasi ke buku

  @ManyToOne(() => Genre, { primary: true })
  genre!: Genre; // Relasi ke genre

}
