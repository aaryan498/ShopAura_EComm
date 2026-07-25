import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "src/generated/prisma/enums";

export class UpdateOrderDto {

    @ApiProperty({
        description: 'Order status',
        example: 'PENDING',
        required: false
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiProperty({
        description: 'Order tracking number',
        example: '1234567890',
        required: false
    })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiProperty({
        description: 'Order notes',
        example: 'Please deliver to the back door',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'Notes must in strin' })
    notes?: string;

}