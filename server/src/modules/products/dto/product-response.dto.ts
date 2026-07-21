import { ApiProperty } from "@nestjs/swagger";


export class ProductResponseDto {
    @ApiProperty({ description: 'Product ID', example: '3b3brqq-qfa3admn-aadhbshf' })
    id!: string;

    @ApiProperty({ description: 'Product Name', example: 'Wireless Headphone' })
    name!: string;

    @ApiProperty({ description: 'Product Description', example: 'High Quality Wireless Headphone with 10 hours of battery life', nullable: true })
    description!: string | null;

    @ApiProperty({ description: 'Product Price in USD', example: 100 })
    price!: number;

    @ApiProperty({ description: 'Product Stock', example: 100 })
    stock!: number;

    @ApiProperty({ description: 'Product Image URL', example: 'https://example.com/image.jpg', nullable: true })
    imageUrl!: string | null;

    @ApiProperty({ description: 'Product SKU', example: 'ABC123' })
    sku!: string;

    @ApiProperty({ description: 'Product Category', example: 'Electronics' })
    category!: string;

    @ApiProperty({ description: 'Whether product is active and available for purchase', example: true })
    isActive!: boolean;

    @ApiProperty({ description: 'Product Creation Date', example: '2023-01-01T00:00:00.000Z' })
    createdAt!: Date;

    @ApiProperty({ description: 'Product Update Date', example: '2023-01-01T00:00:00.000Z' })
    updatedAt!: Date;
}