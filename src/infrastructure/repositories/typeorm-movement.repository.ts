import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { MovementRepository } from '../../core/domain/repositories/movement.repository';
import { MovementEntity } from '../entities/movement.entity';
import { Movement } from '../../core/domain/models/movement.model';
import { MovementMapper } from '../../core/application/mappers/movement.mapper';

@Injectable()
export class TypeOrmMovementRepository implements MovementRepository {
  constructor() { }

  async createWithTransaction(queryRunner: QueryRunner, movement: Movement): Promise<Movement> {
    const movementEntity = await queryRunner.manager.save(MovementEntity, {
      ...movement,
      timestamp: new Date().toISOString(),
    });
    return MovementMapper.toDomainModel(movementEntity);
  }

}
