import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ManageStockUseCase } from '../../../core/application/use-cases/stock/manage-stock.use-case';
import { CreateMovementDto } from '../../../core/application/dtos/create-movement.dto';
import { InvalidMovementTypeException } from '../../../core/domain/exceptions/invalid-movement-type.exception';
import { InventoryTransferMovementException } from '../../../core/domain/exceptions/inventory-transfer-movement.exception';
import { InventoryOutMovementException } from '../../../core/domain/exceptions/inventory-out-movement.exception';
import { InventoryInMovementException } from '../../../core/domain/exceptions/inventory-in-movement.exception';
import { InsufficientStockOutMovementException } from '../../../core/domain/exceptions/insufficient-stock-out-movement.exception';
import { Inventory } from '../../../core/domain/models/inventory.model';
import { GetLowStockProductsUseCase } from '../../../core/application/use-cases/stock/get-low-stock-products.use-case';
import { GetInventoryByStoreIdUseCase } from '../../../core/application/use-cases/stock/get-inventory-by-store-id.use-case';
import { Movement } from '../../../core/domain/models/movement.model';
import { SourceStockNotFoundException } from '../../../core/domain/exceptions/source-stock-not-found.exception';

@Controller()
export class StockController {
  constructor(
    private readonly manageStockUseCase: ManageStockUseCase,
    private readonly getLowStockProductsUseCase: GetLowStockProductsUseCase,
    private readonly getInventoryByStoreIdUseCase: GetInventoryByStoreIdUseCase,
  ) { }

  @Post('inventory/transfer')
  async manageStock(@Body() createMovementDto: CreateMovementDto): Promise<Movement> {
    try {
      return await this.manageStockUseCase.execute(createMovementDto);
    } catch (error) {
      if (error instanceof InvalidMovementTypeException)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      if (error instanceof InventoryInMovementException)
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      if (error instanceof InventoryOutMovementException)
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      if (error instanceof InventoryTransferMovementException)
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      if (error instanceof InsufficientStockOutMovementException)
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      if (error instanceof SourceStockNotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      throw error;
    }
  }

  @Get('inventory/alerts')
  async getLowStockProducts(): Promise<Inventory[]> {
    return await this.getLowStockProductsUseCase.execute();
  }

  @Get('stores/:id/inventory')
  async getInventoryProductByStoreId(@Param('id', ParseIntPipe) id: number): Promise<Inventory[]> {
    return await this.getInventoryByStoreIdUseCase.execute(id);
  }
}
