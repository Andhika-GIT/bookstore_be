import { Migration } from '@mikro-orm/migrations';

export class Migration20240702075840 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "book" ("id" serial primary key, "title" varchar(255) not null, "img_url" varchar(255) not null, "author" varchar(255) not null, "publisher" varchar(255) not null, "description" text not null, "rating" varchar(255) not null, "total_page" int not null, "publication_date" varchar(255) not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "book" cascade;');
  }
}
