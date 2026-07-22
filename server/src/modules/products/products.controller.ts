import { Body, Controller, Get, Param, Patch, Post, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


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



    @Get()
    @ApiOperation({ summary: 'Get all Products' })
    @ApiResponse({
        status: 200,
        description: 'List of all products with pagination',
        schema: { 
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/ProductResponseDto',
                    },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        totalPages: { type: 'number' },
                    }
                }
            }
        }
    })
    async findAll(@Query() queryDto: QueryProductDto): Promise<{
        data: ProductResponseDto[], 
        meta: { total: number, page: number, limit: number, totalPages: number },
    }>{
        return await this.productsService.findAll(queryDto);
    }



    @Get(':id')
    @ApiOperation({ summary: 'Get Product by ID' })
    @ApiResponse({
        status: 200,
        description: 'Product found details',
        type: ProductResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'Product Not Found',
    })
    async findOne(@Param('id') id: string): Promise<ProductResponseDto>{
        return await this.productsService.findOne(id);
    }



    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update Product by ID (ADMIN ONLY)' })
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({
        status: 200,
        description: 'Product updated successfully',
        type: ProductResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Product Not Found',
    })
    @ApiResponse({
        status: 409,
        description: 'Product SKU already exists',
    })
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) : Promise<ProductResponseDto> {
        return await this.productsService.update(id, updateProductDto);
    }


    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update Product Stock by ID (ADMIN ONLY)' })
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                quantity: { 
                    type: 'number',
                    description: 'Stock Adjustment (Positive to add and negative to substract)',
                    example: 12,
                },
            },
            required: ['quantity'],
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Product stock updated successfully',
        type: ProductResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Product Not Found',
    })
    @ApiResponse({
        status: 400,
        description: 'Product stock cannot be negative',
    })
    async updateStock(@Param('id') id: string, @Body('quantity') quantity: number) : Promise<ProductResponseDto> {
        return await this.productsService.updateStock(id, quantity);
    }


    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete Product by ID (ADMIN ONLY)' })
    @ApiResponse({
        status: 200,
        description: 'Product deleted successfully',
    })
    @ApiResponse({
        status: 409,
        description: 'Cannot delete Product that is active in order'
    })
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        return await this.productsService.remove(id);
    }
}
