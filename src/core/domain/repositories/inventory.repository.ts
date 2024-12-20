import { QueryRunner } from "typeorm";
import { Inventory } from "../models/inventory.model";

export abstract class InventoryRepository {
  abstract createWithTransaction(queryRunner: QueryRunner, inventory: Inventory): Promise<Inventory>;
  abstract incrementWithTransaction(queryRunner: QueryRunner, productId: string, quantity: number, storeId: string): Promise<void>;
  abstract decrementWithTransaction(queryRunner: QueryRunner, productId: string, quantity: number, storeId: string): Promise<void>;
  abstract transferWithTransaction(queryRunner: QueryRunner, productId: string, quantity: number, sourceStoreId: string, targetStoreId: string): Promise<void>;
  abstract getByStoreAndProductWithTransaction(queryRunner: QueryRunner, storeId: string, productId: string): Promise<Inventory | undefined>;
  abstract getLowProducts(): Promise<Inventory[] | undefined>;
  abstract getAllByStoreId(storeId: string): Promise<Inventory[] | undefined>;
  abstract countAllByProductId(productId: string): Promise<number>;
}
