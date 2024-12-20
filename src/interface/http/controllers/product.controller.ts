import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Query, Put } from '@nestjs/common';
import { IProductFilters } from '../../../core/domain/interfaces/product-filters.interface';
import { GetProductByIdUseCase } from '../../../core/application/use-cases/product/get-product-by-id.use-case';
import { GetProductsUseCase } from '../../../core/application/use-cases/product/get-products.use-case';
import { Product } from '../../../core/domain/models/product.model';
import { GetProductsQueryDto } from '../../../core/application/dtos/get-products-query.dto';
import { ProductNotFoundException } from '../../../core/domain/exceptions/product-not-found.exception';
import { CreateProductUseCase } from '../../../core/application/use-cases/product/create-product.use-case';
import { CreateProductDto } from '../../../core/application/dtos/create-product.dto';
import { ProductWithSkuAlreadyExistsException } from '../../../core/domain/exceptions/product-with-sku-already-exists.exception';
import { UpdateProductDto } from '../../../core/application/dtos/update-product.dto';
import { UpdateProductUseCase } from '../../../core/application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '../../../core/application/use-cases/product/delete-product.use-case';
import { ProductHasInventoryException } from '../../../core/domain/exceptions/product-has-inventory.exception';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.createProductUseCase.execute(createProductDto);
    } catch (error) {
      if (error instanceof ProductWithSkuAlreadyExistsException)
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      throw error;
    }
  }

  @Get()
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter products by category', example: 'electronics' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Filter products by minimum price', example: 100 })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Filter products by maximum price', example: 500 })
  @ApiQuery({ name: 'stock', required: false, type: Boolean, description: 'Filter products by stock', example: true })
  @ApiOperation({ summary: 'Get all products and you can use some filters as well' })
  async getProducts(
    @Query() query: GetProductsQueryDto
  ): Promise<Product[]> {
    return this.getProductsUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one product by id' })
  async getProductById(@Param('id') id: string): Promise<Product> {
    try {
      return await this.getProductByIdUseCase.execute(id);
    } catch (error) {
      if (error instanceof ProductNotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update one product' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      return await this.updateProductUseCase.execute(id, updateProductDto);
    } catch (error) {
      if (error instanceof ProductNotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ProductWithSkuAlreadyExistsException)
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.deleteProductUseCase.execute(id);
      return { message: `Product with id ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof ProductNotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ProductHasInventoryException)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      throw error;
    }
  }
}
