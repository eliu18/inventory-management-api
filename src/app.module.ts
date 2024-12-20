import { Module } from '@nestjs/common';
import { ProductModule } from './infrastructure/modules/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './infrastructure/database/config/typeorm';
import { StockModule } from './infrastructure/modules/stock.module';
import { InventoryEntity } from './infrastructure/entities/inventory.entity';
import { ProductEntity } from './infrastructure/entities/product.entity';
import { MovementEntity } from './infrastructure/entities/movement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        process.env.NODE_ENV === 'test' ? {
          type: 'sqlite',
          database: ':memory:',
          entities: [ProductEntity, InventoryEntity, MovementEntity],
          synchronize: true,
        } : configService.get('typeorm'),
    }),
    ProductModule,
    StockModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
