export class InventoryOutMovementException extends Error {
    constructor() {
        super(`Source store ID is required for OUT movement.`);
        this.name = 'InventoryOutMovementException';
    }
}