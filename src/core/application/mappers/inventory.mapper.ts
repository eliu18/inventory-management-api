import { Inventory } from "../../../core/domain/models/inventory.model";
import { InventoryEntity } from "../../../infrastructure/entities/inventory.entity";

export class InventoryMapper {
  static toDomainModel(entity: InventoryEntity): Inventory {
    return {
      id: entity.id.toString(),
      productId: entity.productId.toString(),
      storeId: entity.storeId.toString(),
      quantity: +entity.quantity,
      minStock: +entity.minStock,
    };
  }

  static toEntity(inventory: Inventory): InventoryEntity {
    const entity = new InventoryEntity();
    entity.id = inventory.id;
    entity.productId = inventory.productId;
    entity.storeId = inventory.storeId;
    entity.quantity = inventory.quantity;
    entity.minStock = inventory.minStock;
    return entity;
  }
}
