import { Migration } from '@mikro-orm/migrations';

export class Migration20240812054026 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order" ("id" serial primary key, "transaction_id" varchar(255) not null, "total_price" int not null, "status" varchar(255) not null, "user" int not null);');

    this.addSql('create table "order_item" ("id" serial primary key, "order" int not null, "book" int not null, "quantity" int not null, "price" int not null);');

    this.addSql('alter table "order" add constraint "order_user_foreign" foreign key ("user") references "user" ("id") on update cascade;');

    this.addSql('alter table "order_item" add constraint "order_item_order_foreign" foreign key ("order") references "order" ("id") on update cascade;');
    this.addSql('alter table "order_item" add constraint "order_item_book_foreign" foreign key ("book") references "book" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order_item" drop constraint "order_item_order_foreign";');

    this.addSql('drop table if exists "order" cascade;');

    this.addSql('drop table if exists "order_item" cascade;');
  }

}
