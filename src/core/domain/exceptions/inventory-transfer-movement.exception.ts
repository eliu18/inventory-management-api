export class InventoryTransferMovementException extends Error {
    constructor() {
        super(`Both source and target store IDs are required for TRANSFER movement.`);
        this.name = 'InventoryTransferMovementException';
    }
}