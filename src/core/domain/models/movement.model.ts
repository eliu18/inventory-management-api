import { MovementType } from "../enums/movement-type.enum";

export class Movement {
    id: string;
    productId: string;
    quantity: number;
    type: MovementType;
    timestamp?: string;
    sourceStoreId?: string;
    targetStoreId?: string;
}