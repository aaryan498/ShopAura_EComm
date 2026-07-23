import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class OrderItemDto {
    @ApiProperty({
        description: 'Product ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsNotEmpty({ message: 'Product ID is required' })
    @IsString({ message: 'Product ID must be a string' })
    productId! : string;

    @ApiProperty({
        description: 'Product Quantity',
        example: 1
    })
    @IsNotEmpty({ message: 'Quantity is required' })
    @IsNumber({}, { message: 'Quantity must be a number' })
    quantity! : number;


    @ApiProperty({
        description: 'Product Price',
        example: 49.59,
    })
    @IsNumber({
        maxDecimalPlaces: 2,
    }, { message: 'Price must be a valid number (eg: 49.67)' })
    @Type(() => Number)
    price! : number;
}


export class CreateOrderDto {

    @ApiProperty({
        description: 'Order Items',
        type: [OrderItemDto],
    })
    @IsArray({ message: 'Order Items must be an array' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items! : OrderItemDto[];



    @ApiProperty({ required: true })
    @IsOptional()
    @IsString({ message: 'Shipping Address must be a string' })
    shippingAddress! : string;

}