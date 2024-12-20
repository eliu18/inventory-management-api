export class InventoryInMovementException extends Error {
    constructor() {
        super(`Target store ID is required for inventory IN movement.`);
        this.name = 'InventoryInMovementException';
    }
}