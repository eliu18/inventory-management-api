import { Injectable } from '@nestjs/common';
import { Inventory } from '../../../../core/domain/models/inventory.model';
import { InventoryRepository } from '../../../../core/domain/repositories/inventory.repository';

@Injectable()
export class GetInventoryByStoreIdUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) { }

  async execute(storeId: number): Promise<Inventory[]> {
    const inventory = await this.inventoryRepository.getAllByStoreId(storeId.toString());
    return inventory;
  }
}
