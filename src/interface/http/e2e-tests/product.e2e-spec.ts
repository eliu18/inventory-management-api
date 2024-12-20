import { Test, TestingModule } from '@nestjs/testing';
import { ProductEntity } from '../../../infrastructure/entities/product.entity';
import { Repository } from 'typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import supertest from 'supertest';
import { Product } from '../../../core/domain/models/product.model';
import { CreateProductDto } from '../../../core/application/dtos/create-product.dto';
import { UpdateProductDto } from '../../../core/application/dtos/update-product.dto';
import { AppModule } from '../../../app.module';

describe('ProductController (E2E)', () => {
    let app: INestApplication;
    let productRepository: Repository<ProductEntity>;
    let server;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }));
        productRepository = moduleFixture.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
        await app.init();

        server = app.getHttpServer();
    });

    afterEach(async () => {
        await productRepository.clear();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /products', () => {
        it('should return an empty list when no products exist', async () => {
            const response = await supertest(server).get('/products');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return a list of products', async () => {
            const mockProduct: Product = {
                id: null,
                name: 'Product 1',
                description: 'Description 1',
                category: 'Electronics',
                price: 100,
                sku: 'SKU1',
            }
            const mockProductEntity: ProductEntity = productRepository.create(mockProduct);
            await productRepository.save(mockProductEntity);
            const response = await supertest(server).get('/products');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ ...mockProduct, id: "1" }]);
        });
    });

    describe('POST /products', () => {
        it('should create a product', async () => {
            const productDto: CreateProductDto = {
                name: 'New Product',
                description: 'New Description',
                category: 'Category',
                price: 200,
                sku: 'NEW_SKU',
            };
            const response = await supertest(server).post('/products').send(productDto);
            expect(response.status).toBe(201);
            const createdProduct = await productRepository.findOne({ where: { sku: 'NEW_SKU' } });
            expect(createdProduct).toBeDefined();
            expect(createdProduct.name).toBe('New Product');
        });

        it('should fail if required fields are missing', async () => {
            const productDto = { name: 'Incomplete Product' };
            const response = await supertest(server).post('/products').send(productDto);
            expect(response.status).toBe(400);
        });
    });

    describe('UPDATE /products', () => {
        it('should update an existing product', async () => {
            const mockProductDto: CreateProductDto = {
                name: 'Product 1',
                description: 'Description 1',
                category: 'Electronics',
                price: 100,
                sku: 'SKU1',
            }
            const savedProductResponse = await supertest(server).post('/products').send(mockProductDto);
            expect(savedProductResponse.status).toBe(201);

            const updateData: UpdateProductDto = {
                name: 'Updated Product 1',
                price: 150,
            };

            const updateResponse = await supertest(server).put(`/products/${savedProductResponse.body.id}`).send(updateData);
            expect(updateResponse.status).toBe(200);

            const getResponse = await supertest(server).get(`/products/${savedProductResponse.body.id}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual({ ...mockProductDto, ...updateData, id: savedProductResponse.body.id });
        });
    });

    describe('DELETE /products', () => {
        it('should delete an existing product', async () => {
            const mockProductDto: CreateProductDto = {
                name: 'Product 1',
                description: 'Description 1',
                category: 'Electronics',
                price: 100,
                sku: 'SKU1',
            }
            const savedProductResponse = await supertest(server).post('/products').send(mockProductDto);
            expect(savedProductResponse.status).toBe(201);
            const deleteResponse = await supertest(server).delete(`/products/${savedProductResponse.body.id}`);
            expect(deleteResponse.status).toBe(200);
            const getResponse = await supertest(server).get(`/products/${savedProductResponse.body.id}`);
            expect(getResponse.status).toBe(404);
        });
    });

});