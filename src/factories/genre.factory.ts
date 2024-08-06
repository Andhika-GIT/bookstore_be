import { Factory } from '@mikro-orm/seeder';
import { Genre } from '@/genre/entities/genre.entity';

export class GenreFactory extends Factory<Genre> {
  model = Genre;

  definition(): Partial<Genre> {
    const genres = [
      'Romance',
      'Horror',
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Thriller',
      'Non-Fiction',
      'Historical',
      'Adventure',
      'Drama'
    ];

    return {
      name: genres[Math.floor(Math.random() * genres.length)],
    };
  }
}
