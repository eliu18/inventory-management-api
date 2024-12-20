import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inventories1734478349254 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE inventory (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES product(id),
        store_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        min_stock INTEGER NOT NULL DEFAULT 20
      );
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE inventory`);
  }
}
