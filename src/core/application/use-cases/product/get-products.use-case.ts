import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/models/product.model';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { IProductFilters } from '../../../domain/interfaces/product-filters.interface';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { GetProductsQueryDto } from '../../dtos/get-products-query.dto';

@Injectable()
export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) { }

  async execute(query: GetProductsQueryDto): Promise<Product[]> {
    const { category, minPrice, maxPrice, stock, page, limit } = query;
    const filters: IProductFilters = { category, minPrice, maxPrice, stock };
    const defaultPage = 1;
    const defaultLimit = 10;
    const pageNumber = page || defaultPage;
    const pageSize = limit || defaultLimit;
    return this.productRepository.findWithFiltersAndPagination(filters, pageNumber, pageSize);
  }
}
