export class InsufficientStockOutMovementException extends Error {
    constructor() {
        super(`Insufficient stock for OUT movement.`);
        this.name = 'InsufficientStockOutMovementException';
    }
}