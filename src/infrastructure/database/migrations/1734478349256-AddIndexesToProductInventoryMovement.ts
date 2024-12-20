import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesToProductInventoryMovement1734478349256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX idx_product_category ON product (category);`);
    await queryRunner.query(`CREATE INDEX idx_product_price ON product (price);`);
    await queryRunner.query(`CREATE INDEX idx_inventory_store_product ON inventory (store_id, product_id);`);
    await queryRunner.query(`CREATE INDEX idx_inventory_product ON inventory (product_id);`);
    await queryRunner.query(`CREATE INDEX idx_movement_source_store ON movement (source_store_id);`);
    await queryRunner.query(`CREATE INDEX idx_movement_target_store ON movement (target_store_id);`);
    await queryRunner.query(`CREATE INDEX idx_movement_product ON movement (product_id);`);
    await queryRunner.query(`CREATE INDEX idx_movement_type ON movement (type);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_product_category`);
    await queryRunner.query(`DROP INDEX idx_product_price`);
    await queryRunner.query(`DROP INDEX idx_inventory_store_product`);
    await queryRunner.query(`DROP INDEX idx_inventory_product`);
    await queryRunner.query(`DROP INDEX idx_movement_source_store`);
    await queryRunner.query(`DROP INDEX idx_movement_target_store`);
    await queryRunner.query(`DROP INDEX idx_movement_product`);
    await queryRunner.query(`DROP INDEX idx_movement_type`);
  }
}
