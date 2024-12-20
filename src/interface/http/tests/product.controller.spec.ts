import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../controllers/product.controller';
import { GetProductsUseCase } from '../../../core/application/use-cases/product/get-products.use-case';
import { GetProductByIdUseCase } from '../../../core/application/use-cases/product/get-product-by-id.use-case';
import { CreateProductUseCase } from '../../../core/application/use-cases/product/create-product.use-case';
import { UpdateProductUseCase } from '../../../core/application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '../../../core/application/use-cases/product/delete-product.use-case';
import { Product } from '../../../core/domain/models/product.model';
import { GetProductsQueryDto } from '../../../core/application/dtos/get-products-query.dto';
import { CreateProductDto } from '../../../core/application/dtos/create-product.dto';
import { UpdateProductDto } from '../../../core/application/dtos/update-product.dto';



describe('ProductController', () => {
    let controller: ProductController;
    let getProductsUseCase: GetProductsUseCase;
    let getProductByIdUseCase: GetProductByIdUseCase;
    let createProductUseCase: CreateProductUseCase;
    let updateProductUseCase: UpdateProductUseCase;
    let deleteProductUseCase: DeleteProductUseCase;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                { provide: GetProductsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetProductByIdUseCase, useValue: { execute: jest.fn() } },
                { provide: CreateProductUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateProductUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteProductUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();
        controller = module.get<ProductController>(ProductController);
        getProductsUseCase = module.get<GetProductsUseCase>(GetProductsUseCase);
        getProductByIdUseCase = module.get<GetProductByIdUseCase>(GetProductByIdUseCase);
        createProductUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
        updateProductUseCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
        deleteProductUseCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call GetProductsUseCase and return products', async () => {
        const query: GetProductsQueryDto = {};
        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Product 1',
                category: 'Electronics',
                price: 200,
                description: 'Description 1',
                sku: 'SKU1'
            },
            {
                id: '2',
                name: 'Product 2',
                category: 'Electronics',
                price: 250,
                description: 'Description 2',
                sku: 'SKU2'
            }
        ];
        jest.spyOn(getProductsUseCase, 'execute').mockResolvedValue(mockProducts);
        const result = await controller.getProducts(query);
        expect(getProductsUseCase.execute).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockProducts);
    });

    it('should call GetProductByIdUseCase and return the product', async () => {
        const id = '1';
        const mockProduct: Product = {
            id: '1',
            name: 'Product 1',
            category: 'Electronics',
            price: 200,
            description: 'Description 1',
            sku: 'SKU1'
        };
        jest.spyOn(getProductByIdUseCase, 'execute').mockResolvedValue(mockProduct);
        const result = await controller.getProductById(id);
        expect(getProductByIdUseCase.execute).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockProduct);
    });

    it('should call CreateProductUseCase and create the product', async () => {
        const createDto: CreateProductDto = {
            name: 'New Product',
            category: 'Electronics',
            price: 150,
            description: 'Description 1',
            sku: 'SKU1'
        };
        const mockProduct: Product = { id: '1', ...createDto };
        jest.spyOn(createProductUseCase, 'execute').mockResolvedValue(mockProduct);
        const result = await controller.create(createDto);
        expect(createProductUseCase.execute).toHaveBeenCalledWith(createDto);
        expect(result).toEqual(mockProduct);
    });

    it('should call UpdateProductUseCase and update the product', async () => {
        const id = '1';
        const updateDto: UpdateProductDto = { price: 300 };
        const mockUpdatedProduct: Product = {
            id,
            name: updateDto.name || 'Product 1',
            category: updateDto.category || 'Electronics',
            description: updateDto.description || 'Description 1',
            price: updateDto.price || 200,
            sku: updateDto.sku || 'SKU1',
        };
        jest.spyOn(updateProductUseCase, 'execute').mockResolvedValue(mockUpdatedProduct);
        const result = await controller.update(id, updateDto);
        expect(updateProductUseCase.execute).toHaveBeenCalledWith(id, updateDto);
        expect(result).toEqual(mockUpdatedProduct);
    });

    it('should call DeleteProductUseCase and delete the product', async () => {
        const id = '1';
        jest.spyOn(deleteProductUseCase, 'execute').mockResolvedValue(undefined);
        const result = await controller.delete(id);
        expect(deleteProductUseCase.execute).toHaveBeenCalledWith(id);
        expect(result).toStrictEqual({ message: `Product with id ${id} deleted successfully` });
    });

});