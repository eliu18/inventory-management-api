import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/models/product.model';
import { ProductNotFoundException } from '../../../../core/domain/exceptions/product-not-found.exception';
import { ProductRepository } from '../../../../core/domain/repositories/product.repository';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) { }

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findOneById(id);
    if (!product) throw new ProductNotFoundException(id);
    return product;
  }
}