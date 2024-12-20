import { Injectable } from '@nestjs/common';
import { ProductHasInventoryException } from '../../../../core/domain/exceptions/product-has-inventory.exception';
import { ProductNotFoundException } from '../../../../core/domain/exceptions/product-not-found.exception';
import { InventoryRepository } from '../../../../core/domain/repositories/inventory.repository';
import { ProductRepository } from '../../../../core/domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) { }

  async execute(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findOneById(id);
    if (!existingProduct) throw new ProductNotFoundException(id);
    const inventoryCount = await this.inventoryRepository.countAllByProductId(id);
    if (inventoryCount > 0) throw new ProductHasInventoryException(id);
    await this.productRepository.remove(id);
  }
}