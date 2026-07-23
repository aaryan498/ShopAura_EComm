import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";


export class OrderApiResponseDto<T> {

    @ApiProperty({
        description: 'Indicates whether the request was successful or not',
        example: true
    })
    @IsBoolean({ message: 'Success must be a boolean' })
    success! : boolean;

    @ApiProperty({
        description: 'The data returned from the request',
        type: Object,
    })
    data! : T;


    @ApiProperty({
        description: 'Optional Message',
        nullable: true,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Message must be a string' })
    message? : string;


    
}

export class OrderItemResponseDto { 
    @ApiProperty({
        description: 'Order Item ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'ID must be a string' })
    id! : string;

    @ApiProperty({
        description: 'Product ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'Product ID must be a string' })
    productId! : string;

    @ApiProperty({
        description: 'Product Name',
        example: 'Product Name'
    })
    @IsString({ message: 'Product Name must be a string' })
    productName! : string;

    @ApiProperty({
        description: 'Quantity',
        example: 1
    })
    @IsNumber({}, { message: 'Quantity must be a number' })
    quantity! : number;

    @ApiProperty({
        description: 'Price',
        example: 49.59,
    })
    @IsNumber({}, { message: 'Price must be a number' })
    price! : number;

    @ApiProperty({
        description: 'Subtotal',
        example: 49.59,
    })
    @IsNumber({}, { message: 'Subtotal must be a number' })
    subtotal! : number;

    @ApiProperty({
        description: 'Created At',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'Created At must be a date' })
    createdAt! : Date;

    @ApiProperty({
        description: 'Updated At',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'Updated At must be a date' })
    updatedAt! : Date;

}

export class OrderResponseDto {

    @ApiProperty({
        description: 'Order ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'ID must be a string' })
    id! : string;


    @ApiProperty({
        description: 'User ID - To which user the order belongs to',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    @IsString({ message: 'User ID must be a string' })
    userId! : string;


    @ApiProperty({
        description: 'Order Status',
        example: 'Pending'
    })
    @IsString({ message: 'Status must be a string' })
    status! : string;


    @ApiProperty({
        description: 'Total',
        example: 49.59,
    })
    @IsNumber({
        maxDecimalPlaces: 2,
    }, { message: 'Total must be a number' })
    total! : number;


    @ApiProperty({
        description: 'Shipping Address',
        example: '123, Street, City, State, Country, 12345'
    })
    @IsString({ message: 'Shipping Address must be a string' })
    @IsOptional()
    shippingAddress! : string;


    @ApiProperty({
        description: 'Order Items',
        type: [OrderItemResponseDto],
    })
    items! : OrderItemResponseDto[];


    @ApiProperty({
        description: 'Order creation date',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'Created At must be a date' })
    @Type(() => Date)
    createdAt! : Date;


    @ApiProperty({
        description: 'Order update date',
        example: '2021-06-01T00:00:00.000Z'
    })
    @IsDate({ message: 'Updated At must be a date' })
    @Type(() => Date)
    updatedAt! : Date;

}


export class PaginatedOrderResponseDto {
    @ApiProperty({
        description: 'List of orders',
        type: [OrderResponseDto],
    })
    data!: OrderResponseDto[];

    @ApiProperty({
        description: 'Total number of orders',
        example: 100,
    })
    total!: number;

    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    page!: number;

    @ApiProperty({
        description: 'Number of orders per page',
        example: 10,
    })
    limit!: number;

}