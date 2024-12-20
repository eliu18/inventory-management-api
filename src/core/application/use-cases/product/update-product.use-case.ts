import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/models/product.model';
import { ProductNotFoundException } from '../../../../core/domain/exceptions/product-not-found.exception';
import { ProductRepository } from '../../../../core/domain/repositories/product.repository';
import { ProductWithSkuAlreadyExistsException } from '../../../../core/domain/exceptions/product-with-sku-already-exists.exception';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) { }

  async execute(id: string, updateProductDto: Partial<Omit<Product, 'id'>>): Promise<Product> {
    const existingProduct = await this.productRepository.findOneById(id);
    if (!existingProduct) throw new ProductNotFoundException(id);

    if (updateProductDto.sku) {
      const existingProductBySku = await this.productRepository.findOneBySku(updateProductDto.sku);
      if (existingProductBySku && existingProductBySku.id !== id) throw new ProductWithSkuAlreadyExistsException(updateProductDto.sku);
    }

    const product: Product = {
      id,
      name: updateProductDto.name || existingProduct.name,
      description: updateProductDto.description || existingProduct.description,
      category: updateProductDto.category || existingProduct.category,
      price: updateProductDto.price || existingProduct.price,
      sku: updateProductDto.sku || existingProduct.sku,
    };

    return this.productRepository.update(id, product);
  }
}