import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min, ValidateIf } from "class-validator";
import { MovementType } from "../../../core/domain/enums/movement-type.enum";

export class CreateMovementDto {
    @ApiProperty({
        description: 'The ID of the product involved in the movement',
        example: '20',
    })
    @IsNotEmpty()
    @IsNumberString()
    productId: string;

    @ApiProperty({
        description: 'The ID of the source store where the product is coming from',
        example: '30',
    })
    @ValidateIf((o) => o.type === MovementType.OUT || o.type === MovementType.TRANSFER)
    @IsNotEmpty({ message: 'sourceStoreId is required when type is OUT or TRANSFER' })
    @IsNumberString()
    sourceStoreId?: string;

    @ApiProperty({
        description: 'The ID of the target store where the product is being transferred to',
        example: '10',
    })
    @ValidateIf((o) => o.type === MovementType.IN || o.type === MovementType.TRANSFER)
    @IsNotEmpty({ message: 'targetStoreId is required when type is IN or TRANSFER' })
    @IsNumberString()
    targetStoreId?: string;

    @ApiProperty({
        description: 'The quantity of the product to be moved',
        example: 20,
        minimum: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({
        description: 'The type of movement: IN, OUT, or TRANSFER',
        enum: MovementType,
        example: 'TRANSFER',
    })
    @IsNotEmpty()
    @IsEnum(MovementType)
    type: MovementType;
}
