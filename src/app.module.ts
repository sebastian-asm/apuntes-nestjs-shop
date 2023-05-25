import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductsModule } from './products/products.module'
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // cargar automaticamente las entidades a medida que se crean
      autoLoadEntities: true,
      // se recomienda solo en modo dev para sicronizar las entidades de la db
      synchronize: true
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
