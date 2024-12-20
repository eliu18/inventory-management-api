import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IProductFilters } from '../../core/domain/interfaces/product-filters.interface';
import { ProductRepository } from '../../core/domain/repositories/product.repository';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../../core/domain/models/product.model';
import { ProductMapper } from '../../core/application/mappers/product.mapper';
import { InventoryEntity } from '../entities/inventory.entity';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) { }

  async findWithFiltersAndPagination(filters: IProductFilters, page: number, limit: number): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filters.stock) {
      queryBuilder
        .innerJoin(InventoryEntity, 'inventory', 'inventory.product_id = product.id')
        .andWhere('inventory.quantity > 0');
    }

    if (filters.category) {
      queryBuilder.andWhere('product.category = :category', { category: filters.category });
    }

    if (filters.minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const productEntities = await queryBuilder.getMany();
    return productEntities.map(entity => ProductMapper.toDomainModel(entity));
  }

  async findOneById(id: string): Promise<Product | undefined> {
    const productEntity = await this.productRepository.findOne({ where: { id } });
    return productEntity ? ProductMapper.toDomainModel(productEntity) : undefined;
  }

  async findOneBySku(sku: string): Promise<Product | undefined> {
    const productEntity = await this.productRepository.findOne({ where: { sku } });
    return productEntity ? ProductMapper.toDomainModel(productEntity) : undefined;
  }

  async create(product: Product): Promise<Product> {
    const entity = ProductMapper.toEntity(product);
    const savedEntity = await this.productRepository.save(entity);
    return ProductMapper.toDomainModel(savedEntity);
  }

  async update(id: string, product: Product): Promise<Product> {
    const productEntity = ProductMapper.toEntity(product);
    await this.productRepository.update(id, productEntity);
    return this.findOneById(id)
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }


}
