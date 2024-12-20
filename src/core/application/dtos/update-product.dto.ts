import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({
        description: 'The name of the product',
        example: 'Updated Product',
        required: false,
    })
    name?: string;

    @ApiProperty({
        description: 'The description of the product',
        example: 'Updated description of the product',
        required: false,
    })
    description?: string;

    @ApiProperty({
        description: 'The category of the product',
        example: 'Updated Electronics',
        required: false,
    })
    category?: string;

    @ApiProperty({
        description: 'The price of the product',
        example: 49.99,
        required: false,
    })
    price?: number;

    @ApiProperty({
        description: 'The stock keeping unit (SKU) of the product',
        example: '67890XYZ',
        required: false,
    })
    sku?: string;
}
