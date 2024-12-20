import { Product } from "./product.model";

export class Inventory {
    id: string;
    productId: string;
    storeId: string;
    quantity: number;
    minStock: number;
    product?: Product;
}