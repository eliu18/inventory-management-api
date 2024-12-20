import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'The name of the product',
        example: 'Product A',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The description of the product',
        example: 'Description of Product A',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'The category of the product',
        example: 'electronics',
    })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({
        description: 'The price of the product',
        example: 100.0,
    })
    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @Min(0)
    price: number;

    @ApiProperty({
        description: 'The SKU of the product',
        example: 'SKU12345',
    })
    @IsNotEmpty()
    @IsString()
    sku: string;
}
