import { Module } from '@nestjs/common';
import { MovementRepository } from '../../core/domain/repositories/movement.repository';
import { TypeOrmMovementRepository } from '../repositories/typeorm-movement.repository';
import { InventoryEntity } from '../entities/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementEntity } from '../entities/movement.entity';
import { StockController } from '../../interface/http/controllers/stock.controller';
import { GetLowStockProductsUseCase } from '../../core/application/use-cases/stock/get-low-stock-products.use-case';
import { ManageStockUseCase } from '../../core/application/use-cases/stock/manage-stock.use-case';
import { InventoryRepository } from '../../core/domain/repositories/inventory.repository';
import { GetInventoryByStoreIdUseCase } from '../../core/application/use-cases/stock/get-inventory-by-store-id.use-case';
import { TypeOrmInventoryRepository } from '../repositories/typeorm-inventory.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryEntity]),
    TypeOrmModule.forFeature([MovementEntity])
  ],
  controllers: [StockController],
  providers: [
    ManageStockUseCase,
    GetLowStockProductsUseCase,
    GetInventoryByStoreIdUseCase,
    {
      provide: MovementRepository,
      useClass: TypeOrmMovementRepository,
    },
    {
      provide: InventoryRepository,
      useClass: TypeOrmInventoryRepository,
    },
  ],
})
export class StockModule { }
