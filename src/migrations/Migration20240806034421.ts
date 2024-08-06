import { Migration } from '@mikro-orm/migrations';

export class Migration20240806034421 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "book_genre" alter column "id" type int using ("id"::int);');
    this.addSql('create sequence if not exists "book_genre_id_seq";');
    this.addSql('select setval(\'book_genre_id_seq\', (select max("id") from "book_genre"));');
    this.addSql('alter table "book_genre" alter column "id" set default nextval(\'book_genre_id_seq\');');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book_genre" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "book_genre" alter column "id" drop default;');
  }

}
