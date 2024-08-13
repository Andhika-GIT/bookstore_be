import { Migration } from '@mikro-orm/migrations';

export class Migration20240813153826 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" drop column "va_numbers";');

    this.addSql('alter table "order" add column "va_number" varchar(255) null, add column "bank" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "va_number", drop column "bank";');

    this.addSql('alter table "order" add column "va_numbers" text[] null;');
  }

}
