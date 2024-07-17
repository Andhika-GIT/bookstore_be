import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { ConfigService } from '@nestjs/config';
import { entities } from './entities';

const configService = new ConfigService();

const config: Options = {
  entities: entities,
  dbName: configService.get<string>('DB_NAME', 'bookstore'),
  user: configService.get<string>('DB_USER', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  seeder: {
    path: configService.get<string>('SEEDER_PATH', './src/seeds'),
    pathTs: configService.get<string>('SEEDER_PATH_TS', './src/seeds'),
    defaultSeeder: 'DatabaseSeeder',
  },
  migrations: {
    path: configService.get<string>('MIGRATIONS_PATH', './src/migrations'),
    pathTs: configService.get<string>('MIGRATIONS_PATH_TS', './src/migrations'),
    glob: '!(*.d).{js,ts}',
  },
  extensions: [Migrator, SeedManager],
};

export default config;
