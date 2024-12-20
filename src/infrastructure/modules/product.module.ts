import { Module } from '@nestjs/common';
import { ProductController } from '../../interface/http/controllers/product.controller';
import { GetProductsUseCase } from '../../core/application/use-cases/product/get-products.use-case';
import { GetProductByIdUseCase } from '../../core/application/use-cases/product/get-product-by-id.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { TypeOrmProductRepository } from '../repositories/typeorm-product.repository';
import { ProductRepository } from '../../core/domain/repositories/product.repository';
import { CreateProductUseCase } from '../../core/application/use-cases/product/create-product.use-case';
import { UpdateProductUseCase } from '../../core/application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '../../core/application/use-cases/product/delete-product.use-case';
import { InventoryRepository } from '../../core/domain/repositories/inventory.repository';
import { TypeOrmInventoryRepository } from '../repositories/typeorm-inventory.repository';
import { InventoryEntity } from '../entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), TypeOrmModule.forFeature([InventoryEntity])],
  controllers: [ProductController],
  providers: [
    GetProductsUseCase,
    GetProductByIdUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    {
      provide: ProductRepository,
      useClass: TypeOrmProductRepository,
    },
    {
      provide: InventoryRepository,
      useClass: TypeOrmInventoryRepository,
    }
  ],
})
export class ProductModule { }
