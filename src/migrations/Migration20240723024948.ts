import { Migration } from '@mikro-orm/migrations';

export class Migration20240723024948 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "cart" ("id" serial primary key, "user_id_id" int not null, "created_at" timestamptz null default now(), "updated_at" timestamptz null default now());');

    this.addSql('create table "cart_item" ("id" serial primary key, "cart_id_id" int not null, "book_id_id" int not null, "quantity" int not null);');

    this.addSql('alter table "cart" add constraint "cart_user_id_id_foreign" foreign key ("user_id_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "cart_item" add constraint "cart_item_cart_id_id_foreign" foreign key ("cart_id_id") references "cart" ("id") on update cascade;');
    this.addSql('alter table "cart_item" add constraint "cart_item_book_id_id_foreign" foreign key ("book_id_id") references "book" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cart_item" drop constraint "cart_item_cart_id_id_foreign";');

    this.addSql('drop table if exists "cart" cascade;');

    this.addSql('drop table if exists "cart_item" cascade;');
  }

}
