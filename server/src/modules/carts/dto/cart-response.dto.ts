import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDate, IsInt, isInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CartItemResponseDto {

    @ApiProperty({
        description: 'Cart Item ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'id must be a string' })
    @IsNotEmpty({ message: 'id must not be empty' })
    id!: string;

    @ApiProperty({
        description: 'Product ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'productId must be a string' })
    @IsNotEmpty({ message: 'productId must not be empty' })
    productId!: string;

    @ApiProperty({
        description: 'Product Name',
        example: 'HeadPhones',
    })
    @IsString({ message: 'productName must be a string' })
    @IsNotEmpty({ message: 'productName must not be empty' })
    productName!: string;

    @ApiProperty({
        description: 'Product Image URL',
        example: 'https://example.com/image.jpg',
    })
    @IsOptional()
    @IsString({ message: 'productImageUrl must be a string' })
    productImageUrl?: string;

    @ApiProperty({
        description: 'Product price',
        example: 49.59,
    })
    @IsNumber({
        maxDecimalPlaces: 2,
    }, { message: 'price must be a number' })
    @IsNotEmpty({ message: 'price must not be empty' })
    price!: number;

    @ApiProperty({
        description: 'Quantity',
        example: 1,
    })
    @IsInt({ message: 'quantity must be an integer' })
    @IsNotEmpty({ message: 'quantity must not be empty' })
    @Min(0, { message: 'quantity must be greater than 0' })
    quantity!: number;

    @ApiProperty({
        description: 'Subtotal',
        example: 49.59,
    })
    @IsNumber({
        maxDecimalPlaces: 2,
    }, { message: 'subtotal must be a number' })
    @IsNotEmpty({ message: 'subtotal must not be empty' })
    subtotal!: number;

    @ApiProperty({
        description: 'Created At',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'createdAt must be a date' })
    createdAt!: Date;

    @ApiProperty({
        description: 'Updated At',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'updatedAt must be a date' })
    updatedAt!: Date;

}


export class CartResponseDto {

    @ApiProperty({
        description: 'Cart ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'id must be a string' })
    @IsNotEmpty({ message: 'id must not be empty' })
    id!: string;

    @ApiProperty({
        description: 'User ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'user id must be a string' })
    @IsNotEmpty({ message: 'user id must not be empty' })
    userId!: string;

    @ApiProperty({
        description: 'Checkout Completed',
        example: false,
    })
    @IsBoolean({ message: 'checkoutCompleted must be a boolean' })
    checkoutCompleted!: boolean;

    @ApiProperty({
        description: 'Cart Items',
        type: [CartItemResponseDto],
    })
    @IsArray({ message: 'items must be an array' })
    items!: CartItemResponseDto[];

    @ApiProperty({
        description: 'Total Products count',
        example: 12,
    })
    @IsInt({ message: 'totalItems must be an integer' })
    @Min(0, { message: 'totalItems must be at least 0' })
    totalItems!: number;

    @ApiProperty({
        description: 'Total Quantity - summing the quantity of each product in the cart',
        example: 30,
    })
    @IsInt({ message: 'totalQuantity must be an integer' })
    @Min(0, { message: 'totalQuantity must be at least 0' })
    totalQuantity!: number;
    
    @ApiProperty({
        description: 'Total Amount',
        example: 49.59,
    })
    @IsNumber({
        maxDecimalPlaces: 2,
    }, { message: 'totalAmount must be a number' })
    @Min(0, { message: 'totalAmount must be greater than 0' })
    totalAmount!: number;

    @ApiProperty({
        description: 'Created At',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'createdAt must be a date' })
    createdAt!: Date;

    @ApiProperty({
        description: 'Updated At',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'updatedAt must be a date' })
    updatedAt!: Date;

}


export class CartApiResponseDto<T> {

    @ApiProperty({
        description: 'success',
        example: true,
    })
    @IsBoolean({ message: 'success must be a boolean' })
    success!: boolean;

    @ApiProperty({
        description: 'data',
        type: Object,
    })
    @IsNotEmpty({ message: 'data must not be empty' })
    data!: T;


    @ApiProperty({
        description: 'message',
        nullable: true,
        required: false,
    })
    @IsOptional()
    message?: string;

}


