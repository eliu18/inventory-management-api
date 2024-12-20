export class SourceStockNotFoundException extends Error {
    constructor() {
        super(`Source stock not found.`);
        this.name = 'SourceStockNotFoundException';
    }
}