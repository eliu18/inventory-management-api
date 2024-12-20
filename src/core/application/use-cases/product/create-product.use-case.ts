import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/models/product.model';
import { ProductRepository } from '../../../../core/domain/repositories/product.repository';
import { CreateProductDto } from '../../dtos/create-product.dto';
import { ProductWithSkuAlreadyExistsException } from '../../../../core/domain/exceptions/product-with-sku-already-exists.exception';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) { }

  async execute(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOneBySku(createProductDto.sku);
    if (existingProduct) {
      throw new ProductWithSkuAlreadyExistsException(createProductDto.sku);
    }

    const product: Product = {
      id: null,
      name: createProductDto.name,
      description: createProductDto.description,
      category: createProductDto.category,
      price: createProductDto.price,
      sku: createProductDto.sku,
    };

    return this.productRepository.create(product);
  }
}