export class InsufficientStockTransferMovementException extends Error {
    constructor() {
        super(`Insufficient stock in source store for TRANSFER.`);
        this.name = 'InsufficientStockTransferMovementException';
    }
}