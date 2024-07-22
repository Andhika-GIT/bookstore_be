import { Migration } from '@mikro-orm/migrations';

export class Migration20240722014850 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "image_url" to "img_url";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" rename column "img_url" to "image_url";');
  }

}
