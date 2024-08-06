import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Book } from '@/book/entities/book.entity';

export class BookFactory extends Factory<Book> {
  model = Book;

  definition(): Partial<Book> {
    return {
      title: faker.lorem.words(3),
      img_url:
        'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      author: faker.person.fullName(),
      publisher: faker.company.name(),
      description: faker.lorem.paragraph(),
      rating: faker.datatype.number({ min: 1, max: 5 }).toString(),
      total_page: faker.datatype.number({ min: 100, max: 500 }),
      publication_date: faker.date.past().toISOString().split('T')[0],
      price: faker.datatype.float({ min: 10, max: 100, precision: 0.01 }),
      quantity: faker.datatype.number({ min: 1, max: 20 }),
    };
  }

 
}
