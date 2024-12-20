import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from '../controllers/stock.controller';
import { GetInventoryByStoreIdUseCase } from '../../../core/application/use-cases/stock/get-inventory-by-store-id.use-case';
import { GetLowStockProductsUseCase } from '../../../core/application/use-cases/stock/get-low-stock-products.use-case';
import { ManageStockUseCase } from '../../../core/application/use-cases/stock/manage-stock.use-case';
import { Inventory } from '../../../core/domain/models/inventory.model';
import { CreateMovementDto } from '../../../core/application/dtos/create-movement.dto';
import { MovementType } from '../../../core/domain/enums/movement-type.enum';
import { Movement } from '../../../core/domain/models/movement.model';



describe('StockController', () => {
    let controller: StockController;
    let getInventoryByStoreIdUseCase: GetInventoryByStoreIdUseCase;
    let getLowStockProductsUseCase: GetLowStockProductsUseCase;
    let manageStockUseCase: ManageStockUseCase;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StockController],
            providers: [
                { provide: GetInventoryByStoreIdUseCase, useValue: { execute: jest.fn() } },
                { provide: GetLowStockProductsUseCase, useValue: { execute: jest.fn() } },
                { provide: ManageStockUseCase, useValue: { execute: jest.fn() } }
            ],
        }).compile();
        controller = module.get<StockController>(StockController);
        getInventoryByStoreIdUseCase = module.get<GetInventoryByStoreIdUseCase>(GetInventoryByStoreIdUseCase);
        getLowStockProductsUseCase = module.get<GetLowStockProductsUseCase>(GetLowStockProductsUseCase);
        manageStockUseCase = module.get<ManageStockUseCase>(ManageStockUseCase);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call GetInventoryByStoreIdUseCase with the correct store ID and return inventory', async () => {
        const storeId = 1;
        const mockInventory: Inventory[] = [{ id: "3", productId: "1", storeId: "3", quantity: 10, minStock: 20 }];
        jest.spyOn(getInventoryByStoreIdUseCase, 'execute').mockResolvedValue(mockInventory);
        const result = await controller.getInventoryProductByStoreId(storeId);
        expect(getInventoryByStoreIdUseCase.execute).toHaveBeenCalledWith(storeId);
        expect(result).toEqual(mockInventory);
    });

    it('should call GetLowStockProductsUseCase and return low stock products', async () => {
        const mockLowStockProducts: Inventory[] = [
            {
                id: "1",
                productId: "1",
                storeId: "2",
                quantity: 0,
                minStock: 20,
                product: {
                    id: "1",
                    name: "Producto A",
                    description: "Esta es una prueba del producto A",
                    category: "categoria_01",
                    price: 10.2,
                    sku: "A_001"
                }
            },
        ];
        jest.spyOn(getLowStockProductsUseCase, 'execute').mockResolvedValue(mockLowStockProducts);
        const result = await controller.getLowStockProducts();
        expect(getLowStockProductsUseCase.execute).toHaveBeenCalled();
        expect(result).toEqual(mockLowStockProducts);
    });

    it('should call ManageStockUseCase with the correct DTO and return success', async () => {
        const mockCreateMovementDto: CreateMovementDto = {
            productId: 'prod1',
            sourceStoreId: 'store1',
            targetStoreId: 'store2',
            quantity: 10,
            type: MovementType.TRANSFER,
        };
        const mockResponse: Movement = {
            id: "8",
            productId: "1",
            quantity: 10,
            type: MovementType.TRANSFER,
            timestamp: "2024-12-19T00:00:00.409Z",
            sourceStoreId: "1",
            targetStoreId: "3"
        };
        jest.spyOn(manageStockUseCase, 'execute').mockResolvedValue(mockResponse);
        const result = await controller.manageStock(mockCreateMovementDto);
        expect(manageStockUseCase.execute).toHaveBeenCalledWith(mockCreateMovementDto);
        expect(result).toEqual(mockResponse);
    });
});