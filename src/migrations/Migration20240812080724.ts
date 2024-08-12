import { Migration } from '@mikro-orm/migrations';

export class Migration20240812080724 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" rename column "transaction_id" to "order_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" rename column "order_id" to "transaction_id";');
  }

}
