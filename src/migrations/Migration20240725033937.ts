import { Migration } from '@mikro-orm/migrations';

export class Migration20240725033937 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "cart" drop constraint "cart_user_id_foreign";');

    this.addSql('alter table "cart_item" drop constraint "cart_item_cart_id_foreign";');
    this.addSql('alter table "cart_item" drop constraint "cart_item_book_id_foreign";');

    this.addSql('alter table "cart" rename column "user_id" to "user";');
    this.addSql('alter table "cart" add constraint "cart_user_foreign" foreign key ("user") references "user" ("id") on update cascade;');

    this.addSql('alter table "cart_item" drop column "cart_id", drop column "book_id";');

    this.addSql('alter table "cart_item" add column "cart" int not null, add column "book" int not null;');
    this.addSql('alter table "cart_item" add constraint "cart_item_cart_foreign" foreign key ("cart") references "cart" ("id") on update cascade;');
    this.addSql('alter table "cart_item" add constraint "cart_item_book_foreign" foreign key ("book") references "book" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cart" drop constraint "cart_user_foreign";');

    this.addSql('alter table "cart_item" drop constraint "cart_item_cart_foreign";');
    this.addSql('alter table "cart_item" drop constraint "cart_item_book_foreign";');

    this.addSql('alter table "cart" rename column "user" to "user_id";');
    this.addSql('alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "cart_item" drop column "cart", drop column "book";');

    this.addSql('alter table "cart_item" add column "cart_id" int not null, add column "book_id" int not null;');
    this.addSql('alter table "cart_item" add constraint "cart_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');
    this.addSql('alter table "cart_item" add constraint "cart_item_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade;');
  }

}
