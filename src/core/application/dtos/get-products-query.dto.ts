import { Transform } from 'class-transformer';
import { IsBooleanString, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetProductsQueryDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @IsBooleanString()
    stock?: boolean;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    limit?: number;
}
