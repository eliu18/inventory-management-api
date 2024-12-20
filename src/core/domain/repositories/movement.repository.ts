import { QueryRunner } from "typeorm";
import { Movement } from "../models/movement.model";

export abstract class MovementRepository {
  abstract createWithTransaction(queryRunner: QueryRunner, movement: Movement): Promise<Movement>;
}
