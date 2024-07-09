import { Migration } from '@mikro-orm/migrations';

export class Migration20240709044848 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "book" alter column "updated_at" set default now();');

    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default now();');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "updated_at" drop default;');
    this.addSql('alter table "book" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "user" alter column "updated_at" drop default;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
  }

}
