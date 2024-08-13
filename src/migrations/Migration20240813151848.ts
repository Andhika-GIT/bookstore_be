import { Migration } from '@mikro-orm/migrations';

export class Migration20240813151848 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" add column "payment_type" varchar(255) not null, add column "va_numbers" text[] null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "payment_type", drop column "va_numbers";');
  }

}
