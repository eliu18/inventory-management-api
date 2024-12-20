import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('inventory')
export class InventoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'store_id' })
  storeId: string;

  @Column('int')
  quantity: number;

  @Column('int', { default: 20, name: 'min_stock' })
  minStock: number;
}