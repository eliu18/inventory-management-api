import { Movement } from "../../../core/domain/models/movement.model";
import { MovementEntity } from "../../../infrastructure/entities/movement.entity";

export class MovementMapper {
  static toDomainModel(entity: MovementEntity): Movement {
    return {
      id: entity.id.toString(),
      productId: entity.productId.toString(),
      quantity: +entity.quantity,
      type: entity.type,
      timestamp: entity.timestamp,
      sourceStoreId: entity.sourceStoreId?.toString(),
      targetStoreId: entity.targetStoreId?.toString(),
    };
  }

  static toEntity(movement: Movement): MovementEntity {
    const entity = new MovementEntity();
    entity.id = movement.id;
    entity.productId = movement.productId;
    entity.quantity = movement.quantity;
    entity.type = movement.type;
    entity.timestamp = movement.timestamp;
    entity.sourceStoreId = movement?.sourceStoreId;
    entity.targetStoreId = movement?.targetStoreId;
    return entity;
  }
}
