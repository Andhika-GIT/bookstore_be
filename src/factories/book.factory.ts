import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Book } from '@/book/entities/book.entity';

export class BookFactory extends Factory<Book> {
  model = Book;

  definition(): Partial<Book> {
    return {
      title: faker.lorem.words(3),
      imgURL:
        'https://cdn.discordapp.com/attachments/788618872953503745/1257597601612697670/stay-with-me.jpg?ex=6684fc89&is=6683ab09&hm=45c3faf501db131658dc7f4f3709177310b0d4b41c22f36890a90fd490da1b0e&',
      author: faker.person.fullName(),
      publisher: faker.company.name(),
      description: faker.lorem.paragraph(),
      rating: faker.datatype.number({ min: 1, max: 5 }).toString(),
      total_page: faker.datatype.number({ min: 100, max: 500 }),
      publication_date: faker.date.past().toISOString().split('T')[0],
    };
  }
}
