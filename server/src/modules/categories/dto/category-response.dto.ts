import { ApiProperty } from "@nestjs/swagger"


export class CategoryResponseDto{

    @ApiProperty({ description: 'Category ID', example: '123e4567-e89b-12d3-a456-4266' })
    id! : string

    @ApiProperty({ description: 'Category name', example: 'Electronics' })
    name! : string

    @ApiProperty({ description: 'Category description', example: 'Electronics category', nullable: true })
    description! : string | null

    @ApiProperty({ description: 'Category slug', example: 'electronics', nullable: true })
    slug! : string | null

    @ApiProperty({ description: 'Category image', example: 'https://example.com/image.jpg', nullable: true })
    imageUrl! : string | null

    @ApiProperty({ description: 'Indicates if category is active', example: true })
    isActive! : boolean

    @ApiProperty({ description: 'Number of Products in this category', example: 150 })
    productCount! : number

    @ApiProperty({ description: 'Category Creation Date', example: '2023-01-01T00:00:00.00' })
    createdAt! : Date

    @ApiProperty({ description: 'Category Updated Date', example: '2023-01-01T00:00:00.00' })
    updatedAt! : Date


}