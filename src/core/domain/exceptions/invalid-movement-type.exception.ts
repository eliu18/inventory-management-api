export class InvalidMovementTypeException extends Error {
    constructor() {
        super(`Invalid movement type.`);
        this.name = 'InvalidMovementTypeException';
    }
}