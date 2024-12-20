import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../../../../core/domain/repositories/inventory.repository';
import { Inventory } from '../../../../core/domain/models/inventory.model';

@Injectable()
export class GetLowStockProductsUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) { }

  async execute(): Promise<Inventory[]> {
    const inventory = await this.inventoryRepository.getLowProducts();
    return inventory;
  }
}
