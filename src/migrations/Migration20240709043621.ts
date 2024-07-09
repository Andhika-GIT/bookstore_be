import { Migration } from '@mikro-orm/migrations';

export class Migration20240709043621 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "book" ("id" serial primary key, "title" varchar(255) not null, "img_url" varchar(255) not null, "author" varchar(255) not null, "publisher" varchar(255) not null, "description" text not null, "rating" varchar(255) not null, "total_page" int not null, "publication_date" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null);',
    );

    this.addSql(
      'create table "user" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "image_url" varchar(255) not null, "email" varchar(255) not null, "address" text not null, "phone_number" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "book" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }
}
