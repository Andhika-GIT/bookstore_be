import { Migration } from '@mikro-orm/migrations';

export class Migration20240719012234 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" add column "quantity" numeric(10,0) not null;');
    this.addSql('alter table "book" alter column "total_page" type numeric(10,0) using ("total_page"::numeric(10,0));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" drop column "quantity";');

    this.addSql('alter table "book" alter column "total_page" type int using ("total_page"::int);');
  }

}
