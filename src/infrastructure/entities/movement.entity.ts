import { MovementType } from "../../core/domain/enums/movement-type.enum";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('movement')
export class MovementEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({ name: 'product_id' })
    productId: string;

    @Column({ name: 'source_store_id', nullable: true })
    sourceStoreId: string;

    @Column({ name: 'target_store_id', nullable: true })
    targetStoreId: string;

    @Column('int')
    quantity: number;

    @Column({ type: 'text' })
    timestamp: string;

    @Column({ type: 'text' })
    type: MovementType;
}