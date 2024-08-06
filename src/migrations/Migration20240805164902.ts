import { Migration } from '@mikro-orm/migrations';

export class Migration20240805164902 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "genre" ("id" serial primary key, "name" varchar(255) not null);');
    
    this.addSql('create table "book_genre" ("id" serial primary key, "book_id" int not null, "genre_id" int not null, ' +
      'constraint "fk_book" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade, ' +
      'constraint "fk_genre" foreign key ("genre_id") references "genre" ("id") on update cascade on delete cascade);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "book_genre" cascade;');
    this.addSql('drop table if exists "genre" cascade;');
  }

}
