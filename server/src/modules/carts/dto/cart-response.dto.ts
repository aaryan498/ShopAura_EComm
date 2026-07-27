import { ApiProperty } from "@nestjs/swagger";

export class CartItemResponseDto {

    @ApiProperty({
        description: 'Cart Item ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    id!: string;

    @ApiProperty({
        description: 'Product ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    productId!: string;

    @ApiProperty({
        description: 'Product Name',
        example: 'HeadPhones',
    })
    productName!: string;

    @ApiProperty({
        description: 'Product Image URL',
        example: 'https://example.com/image.jpg',
    })
    productImageUrl?: string;

    @ApiProperty({
        description: 'Product price',
        example: 49.59,
    })
    price!: number;

    @ApiProperty({
        description: 'Quantity',
        example: 1,
    })
    quantity!: number;

    @ApiProperty({
        description: 'Subtotal',
        example: 49.59,
    })
    subtotal!: number;

    @ApiProperty({
        description: 'Created At',
        example: '2021-06-01T00:00:00.000Z'
    })
    createdAt!: Date;

    @ApiProperty({
        description: 'Updated At',
        example: '2021-06-01T00:00:00.000Z'
    })
    updatedAt!: Date;

}


export class CartResponseDto {

    @ApiProperty({
        description: 'Cart ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    id!: string;

    @ApiProperty({
        description: 'User ID',
        example: '12jsdjks-2kbssbv-hsvdhsk'
    })
    userId!: string;

    @ApiProperty({
        description: 'Checkout Completed',
        example: false,
    })
    checkoutCompleted!: boolean;

    @ApiProperty({
        description: 'Cart Items',
        type: [CartItemResponseDto],
    })
    items!: CartItemResponseDto[];

    @ApiProperty({
        description: 'Total Products count',
        example: 12,
    })
    totalItems!: number;

    @ApiProperty({
        description: 'Total Quantity - summing the quantity of each product in the cart',
        example: 30,
    })
    totalQuantity!: number;
    
    @ApiProperty({
        description: 'Total Amount',
        example: 49.59,
    })
    totalAmount!: number;

    @ApiProperty({
        description: 'Created At',
        example: '2021-06-01T00:00:00.000Z'
    })
    createdAt!: Date;

    @ApiProperty({
        description: 'Updated At',
        example: '2021-06-01T00:00:00.000Z'
    })
    updatedAt!: Date;

}


export class CartApiResponseDto<T> {

    @ApiProperty({
        description: 'success',
        example: true,
    })
    success!: boolean;

    @ApiProperty({
        description: 'data',
        type: Object,
    })
    data!: T;


    @ApiProperty({
        description: 'message',
        nullable: true,
        required: false,
    })
    message?: string;

}


