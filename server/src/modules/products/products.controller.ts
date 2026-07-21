import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';


@ApiTags('Products')
@Controller('products')
export class ProductsController {

    constructor( private readonly productsService: ProductsService ) {}


    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create New Product (ADMIN ONLY)' })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({
        status: 201,
        description: 'Product created successfully',
        type: ProductResponseDto
    })
    @ApiResponse({
        status: 409,
        description: 'SKU already exists'
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - required ADMIN Role'
    })
    async create(@Body() createProductDto: CreateProductDto) : Promise<ProductResponseDto> {
        return await this.productsService.create(createProductDto);
    }
}
