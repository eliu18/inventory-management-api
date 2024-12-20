import { Injectable } from '@nestjs/common';
import { MovementRepository } from '../../../../core/domain/repositories/movement.repository';
import { CreateMovementDto } from '../../dtos/create-movement.dto';
import { InventoryRepository } from '../../../../core/domain/repositories/inventory.repository';
import { DataSource, QueryRunner } from 'typeorm';
import { InsufficientStockOutMovementException } from '../../../../core/domain/exceptions/insufficient-stock-out-movement.exception';
import { InventoryInMovementException } from '../../../../core/domain/exceptions/inventory-in-movement.exception';
import { InventoryOutMovementException } from '../../../../core/domain/exceptions/inventory-out-movement.exception';
import { InventoryTransferMovementException } from '../../../../core/domain/exceptions/inventory-transfer-movement.exception';
import { InvalidMovementTypeException } from '../../../../core/domain/exceptions/invalid-movement-type.exception';
import { Movement } from '../../../../core/domain/models/movement.model';
import { Inventory } from '../../../../core/domain/models/inventory.model';
import { SourceStockNotFoundException } from '../../../../core/domain/exceptions/source-stock-not-found.exception';

@Injectable()
export class ManageStockUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly movementRepository: MovementRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) { }

  async execute(createMovementDto: CreateMovementDto): Promise<Movement> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { productId, sourceStoreId, targetStoreId, quantity, type } = createMovementDto;
      switch (type) {
        case 'IN':
          await this.handleInMovement(queryRunner, productId, targetStoreId, quantity);
          break;

        case 'OUT':
          await this.handleOutMovement(queryRunner, productId, sourceStoreId, quantity);
          break;

        case 'TRANSFER':
          await this.handleTransferMovement(queryRunner, productId, sourceStoreId, targetStoreId, quantity);
          break;

        default:
          throw new InvalidMovementTypeException();
      }
      const newMovement: Movement = {
        id: null,
        productId,
        quantity,
        type,
        sourceStoreId,
        targetStoreId,
      }
      const movement = await this.movementRepository.createWithTransaction(queryRunner, newMovement);
      await queryRunner.commitTransaction();
      return movement;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async handleInMovement(queryRunner: QueryRunner, productId: string, storeId: string, quantity: number): Promise<void> {
    if (!storeId) throw new InventoryInMovementException();
    const sourceInventory = await this.inventoryRepository.getByStoreAndProductWithTransaction(queryRunner, storeId, productId);
    if (!sourceInventory) {
      const sourceInventory: Inventory = { id: null, productId, storeId, quantity, minStock: undefined }
      await this.inventoryRepository.createWithTransaction(queryRunner, sourceInventory);
    } else {
      await this.inventoryRepository.incrementWithTransaction(queryRunner, productId, quantity, storeId);
    }
  }

  private async handleOutMovement(queryRunner: QueryRunner, productId: string, storeId: string, quantity: number): Promise<void> {
    if (!storeId) throw new InventoryOutMovementException()
    const sourceStock = await this.inventoryRepository.getByStoreAndProductWithTransaction(queryRunner, storeId, productId);
    if (!sourceStock) throw new SourceStockNotFoundException();
    if (sourceStock.quantity < quantity) throw new InsufficientStockOutMovementException();
    await this.inventoryRepository.decrementWithTransaction(queryRunner, productId, quantity, storeId);
  }

  private async handleTransferMovement(queryRunner: QueryRunner, productId: string, sourceStoreId: string, targetStoreId: string, quantity: number): Promise<void> {
    if (!sourceStoreId || !targetStoreId) throw new InventoryTransferMovementException();
    const sourceStock = await this.inventoryRepository.getByStoreAndProductWithTransaction(queryRunner, sourceStoreId, productId);
    if (!sourceStock) throw new SourceStockNotFoundException();
    if (sourceStock.quantity < quantity) throw new InsufficientStockOutMovementException();
    const targetStock = await this.inventoryRepository.getByStoreAndProductWithTransaction(queryRunner, targetStoreId, productId);
    if (!targetStock) {
      const targetInventory: Inventory = { id: null, productId, storeId: targetStoreId, quantity: 0, minStock: undefined }
      await this.inventoryRepository.createWithTransaction(queryRunner, targetInventory);
    }
    await this.inventoryRepository.transferWithTransaction(queryRunner, productId, quantity, sourceStoreId, targetStoreId,);
  }
}