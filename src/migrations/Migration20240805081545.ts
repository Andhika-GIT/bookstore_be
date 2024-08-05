import { Migration } from '@mikro-orm/migrations';

export class Migration20240805081545 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" add column "price" real not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" drop column "price";');
  }

}
