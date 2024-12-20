import { IProductFilters } from "../interfaces/product-filters.interface";
import { Product } from "../models/product.model";

export abstract class ProductRepository {
  abstract findWithFiltersAndPagination(filters: IProductFilters, page: number, limit: number): Promise<Product[]>;
  abstract findOneById(id: string): Promise<Product | undefined>;
  abstract findOneBySku(sku: string): Promise<Product | undefined>;
  abstract create(product: Product): Promise<Product>;
  abstract update(id: string, product: Product): Promise<Product>;
  abstract remove(id: string): Promise<void>;
}
