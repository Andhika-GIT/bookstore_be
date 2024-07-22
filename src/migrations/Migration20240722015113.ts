import { Migration } from '@mikro-orm/migrations';

export class Migration20240722015113 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "quantity";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" add column "quantity" numeric(10,0) not null;');
  }

}
