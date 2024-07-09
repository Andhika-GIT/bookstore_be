import { Migration } from '@mikro-orm/migrations';

export class Migration20240709054835 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "book" alter column "created_at" drop not null;');
    this.addSql('alter table "book" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "book" alter column "updated_at" drop not null;');

    this.addSql('alter table "user" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));');
    this.addSql('alter table "user" alter column "image_url" drop not null;');
    this.addSql('alter table "user" alter column "address" type text using ("address"::text);');
    this.addSql('alter table "user" alter column "address" drop not null;');
    this.addSql('alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user" alter column "created_at" drop not null;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "book" alter column "created_at" set not null;');
    this.addSql('alter table "book" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "book" alter column "updated_at" set not null;');

    this.addSql('alter table "user" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));');
    this.addSql('alter table "user" alter column "image_url" set not null;');
    this.addSql('alter table "user" alter column "address" type text using ("address"::text);');
    this.addSql('alter table "user" alter column "address" set not null;');
    this.addSql('alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user" alter column "created_at" set not null;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set not null;');
  }

}
