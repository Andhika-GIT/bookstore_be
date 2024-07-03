import { Options } from '@mikro-orm/core';
import { Book } from './book/entities/book.entity';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

const config: Options = {
  entities: [Book],
  dbName: 'bookstore',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  seeder: {
    path: './src/seeds',
    defaultSeeder: 'DatabaseSeeder',
  },
  migrations: {
    path: './src/migrations',
  },
  extensions: [Migrator, SeedManager],
};

export default config;
