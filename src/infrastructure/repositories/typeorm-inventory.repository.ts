import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { InventoryRepository } from '../../core/domain/repositories/inventory.repository';
import { InventoryEntity } from '../entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../../core/domain/models/inventory.model';
import { InventoryMapper } from '../../core/application/mappers/inventory.mapper';
import { ProductMapper } from '../../core/application/mappers/product.mapper';

@Injectable()
export class TypeOrmInventoryRepository implements InventoryRepository {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepository: Repository<InventoryEntity>,
  ) { }

  async createWithTransaction(queryRunner: QueryRunner, inventory: Inventory): Promise<Inventory> {
    const inventoryEntity = await queryRunner.manager.getRepository(InventoryEntity).save(InventoryMapper.toEntity(inventory));
    return InventoryMapper.toDomainModel(inventoryEntity);
  }

  async incrementWithTransaction(queryRunner: QueryRunner, productId: string, quantity: number, storeId: string): Promise<void> {
    await queryRunner.manager.increment(InventoryEntity, { storeId, productId }, 'quantity', quantity);
  }

  async decrementWithTransaction(queryRunner: QueryRunner, productId: string, quantity: number, storeId: string): Promise<void> {
    await queryRunner.manager.decrement(InventoryEntity, { storeId, productId }, 'quantity', quantity);
  }

  async transferWithTransaction(queryRunner: QueryRunner, productId: string, quantity: number, sourceStoreId: string, targetStoreId: string): Promise<void> {
    await this.decrementWithTransaction(queryRunner, productId, quantity, sourceStoreId);
    await this.incrementWithTransaction(queryRunner, productId, quantity, targetStoreId);
  }

  async getByStoreAndProductWithTransaction(queryRunner: QueryRunner, storeId: string, productId: string): Promise<Inventory | undefined> {
    const inventoryEntity = await queryRunner.manager.getRepository(InventoryEntity).findOne({ where: { storeId, productId } });
    return inventoryEntity ? InventoryMapper.toDomainModel(inventoryEntity) : undefined;
  }

  async getLowProducts(): Promise<Inventory[]> {
    const inventoryEntities = await this.inventoryRepository.createQueryBuilder('inventory')
      .innerJoinAndSelect('inventory.product', 'product')
      .where('inventory.quantity < inventory.minStock')
      .getMany();
    return inventoryEntities.map(entity => {
      const product = ProductMapper.toDomainModel(entity.product);
      const inventory = InventoryMapper.toDomainModel(entity);
      inventory.product = product;
      return inventory
    });
  }

  async getAllByStoreId(storeId: string): Promise<Inventory[]> {
    const inventoryEntities = await this.inventoryRepository.find({ where: { storeId } });
    return inventoryEntities.map(InventoryMapper.toDomainModel);
  }

  async countAllByProductId(productId: string): Promise<number> {
    return this.inventoryRepository.count({ where: { productId } });
  }
}
