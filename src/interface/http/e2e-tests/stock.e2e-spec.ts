import { Test, TestingModule } from '@nestjs/testing';
import { ProductEntity } from '../../../infrastructure/entities/product.entity';
import { Repository } from 'typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import supertest from 'supertest';
import { CreateProductDto } from '../../../core/application/dtos/create-product.dto';
import { InventoryEntity } from '../../../infrastructure/entities/inventory.entity';
import { AppModule } from '../../../app.module';
import { CreateMovementDto } from '../../../core/application/dtos/create-movement.dto';
import { MovementType } from '../../../core/domain/enums/movement-type.enum';
import { MovementEntity } from '../../../infrastructure/entities/movement.entity';

describe('StockController (E2E)', () => {
    let app: INestApplication;
    let productRepository: Repository<ProductEntity>;
    let inventoryRepository: Repository<InventoryEntity>;
    let movementRepository: Repository<MovementEntity>;
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
        inventoryRepository = moduleFixture.get<Repository<InventoryEntity>>(getRepositoryToken(InventoryEntity));
        movementRepository = moduleFixture.get<Repository<MovementEntity>>(getRepositoryToken(MovementEntity));
        await app.init();
        server = app.getHttpServer();
    });

    afterEach(async () => {
        await movementRepository.clear();
        await inventoryRepository.clear();
        await productRepository.clear();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /inventory/transfer', () => {
        it('should successfully transfer stock in store', async () => {
            // Se crea el producto
            const productDto: CreateProductDto = {
                name: 'New Product',
                description: 'New Description',
                category: 'Category',
                price: 200,
                sku: 'NEW_SKU',
            };
            const createProductResponse = await supertest(server).post('/products').send(productDto);
            expect(createProductResponse.status).toBe(201);

            // Se crea un movimiento de entrada algun almacen
            const productId = createProductResponse.body.id;
            const mockMovement: CreateMovementDto = {
                productId,
                targetStoreId: "1",
                quantity: 20,
                type: MovementType.IN,
            };
            const response = await supertest(server).post('/inventory/transfer').send(mockMovement).expect(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.productId).toEqual(mockMovement.productId);
            expect(response.body.targetStoreId).toEqual(mockMovement.targetStoreId);
            expect(response.body.quantity).toEqual(mockMovement.quantity);
        });

        it('should successfully transfer stock between store', async () => {
            // Se crea el producto
            const productDto: CreateProductDto = {
                name: 'New Product',
                description: 'New Description',
                category: 'Category',
                price: 200,
                sku: 'NEW_SKU',
            };
            const createProductResponse = await supertest(server).post('/products').send(productDto);
            expect(createProductResponse.status).toBe(201);

            // Se crea un movimiento de entrada algun almacen
            const productId = createProductResponse.body.id;
            const mockMovementIn: CreateMovementDto = {
                productId,
                targetStoreId: "1",
                quantity: 20,
                type: MovementType.IN,
            };
            await supertest(server).post('/inventory/transfer').send(mockMovementIn).expect(201);

            // Se crea un movimiento de transferencia a un almacen diferente
            const mockMovementTransfer: CreateMovementDto = {
                productId,
                sourceStoreId: "1",
                targetStoreId: "2",
                quantity: 5,
                type: MovementType.TRANSFER,
            };
            const transferResponse = await supertest(server).post('/inventory/transfer').send(mockMovementTransfer).expect(201);
            expect(transferResponse.body).toHaveProperty('id');
            expect(transferResponse.body.productId).toEqual(mockMovementTransfer.productId);
            expect(transferResponse.body.sourceStoreId).toEqual(mockMovementTransfer.sourceStoreId);
            expect(transferResponse.body.targetStoreId).toEqual(mockMovementTransfer.targetStoreId);
            expect(transferResponse.body.quantity).toEqual(mockMovementTransfer.quantity);
        });
    });

    describe('GET /stores/:id/inventory', () => {
        it('should return inventory for a specific store', async () => {
            // Se crea el producto
            const productDto: CreateProductDto = {
                name: 'New Product',
                description: 'New Description',
                category: 'Category',
                price: 200,
                sku: 'NEW_SKU',
            };
            const createProductResponse = await supertest(server).post('/products').send(productDto);
            expect(createProductResponse.status).toBe(201);

            // Se crea un movimiento de entrada algun almacen
            const productId = createProductResponse.body.id;
            const storeId = 1;
            const mockMovementIn: CreateMovementDto = {
                productId,
                targetStoreId: storeId.toString(),
                quantity: 20,
                type: MovementType.IN,
            };
            await supertest(server).post('/inventory/transfer').send(mockMovementIn).expect(201);

            const response = await supertest(app.getHttpServer()).get(`/stores/${storeId}/inventory`).expect(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('productId');
            expect(response.body[0]).toHaveProperty('quantity');
        });
    });

    describe('GET /inventory/alerts', () => {
        it('should return a list of products with low stock', async () => {
            // Se crea el producto
            const productDto: CreateProductDto = {
                name: 'New Product',
                description: 'New Description',
                category: 'Category',
                price: 200,
                sku: 'NEW_SKU',
            };
            const createProductResponse = await supertest(server).post('/products').send(productDto);
            expect(createProductResponse.status).toBe(201);

            // Se crea un movimiento de entrada algun almacen
            const productId = createProductResponse.body.id;
            const mockMovementIn: CreateMovementDto = {
                productId,
                targetStoreId: "1",
                quantity: 20,
                type: MovementType.IN,
            };
            await supertest(server).post('/inventory/transfer').send(mockMovementIn).expect(201);

            // Se crea un movimiento de salida en el producto anteriormente creado
            const mockMovementOut: CreateMovementDto = {
                productId,
                sourceStoreId: "1",
                quantity: 10,
                type: MovementType.OUT,
            };
            await supertest(server).post('/inventory/transfer').send(mockMovementOut).expect(201);

            // Se obtienen los productos con stock bajo
            const response = await supertest(app.getHttpServer()).get('/inventory/alerts').expect(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('productId');
            expect(response.body[0]).toHaveProperty('quantity');
        });
    });

});