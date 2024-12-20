import { MigrationInterface, QueryRunner } from 'typeorm';

export class Movements1734478349255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE movement (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES product(id),
        source_store_id INTEGER NULL,
        target_store_id INTEGER NULL,
        quantity INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type VARCHAR(10) CHECK(type IN ('IN', 'OUT', 'TRANSFER'))
      );
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE movement`);
  }
}
