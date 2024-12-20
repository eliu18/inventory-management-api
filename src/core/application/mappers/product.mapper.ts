import { Product } from "../../../core/domain/models/product.model";
import { ProductEntity } from "../../../infrastructure/entities/product.entity";

export class ProductMapper {
  static toDomainModel(entity: ProductEntity): Product {
    return {
      id: entity.id.toString(),
      name: entity.name,
      description: entity.description,
      category: entity.category,
      price: +entity.price,
      sku: entity.sku,
    };
  }

  static toEntity(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id;
    entity.name = product.name;
    entity.description = product.description;
    entity.category = product.category;
    entity.price = product.price;
    entity.sku = product.sku;
    return entity;
  }
}
