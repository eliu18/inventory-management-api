export class ProductHasInventoryException extends Error {
    constructor(id: string) {
        super(`Cannot delete product with id ${id} because it has associated inventory records.`);
        this.name = 'ProductHasInventoryException';
    }
}