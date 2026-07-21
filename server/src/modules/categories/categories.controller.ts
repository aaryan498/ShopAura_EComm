import { Body, Controller, Get, Post, Query, UseGuards, Param, Delete, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 409,
        description: 'Category already exists',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid Input Data',
    })
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) : Promise<CategoryResponseDto> {
        return await this.categoriesService.createCategory(createCategoryDto);
    }



    // Get all categories
    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        status: 200,
        description: 'Categories retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CategoryResponseDto' }
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                }
            }
        }
    })
    async findAll(@Query() queryDto: QueryCategoryDto) {
        return await this.categoriesService.findAll(queryDto);
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get Category by Id' })
    @ApiResponse({
        status: 200,
        description: 'Category details retrieved successfully',
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Category not Found'
    })
    async findOne(@Param('id') id: string) : Promise<CategoryResponseDto> {
        return await this.categoriesService.findOne(id);
    }



    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get Category by Slug' })
    @ApiResponse({
        status: 200,
        description: 'Category details by slug',
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Category with given slug not Found'
    })
    async findBySlug(@Param('slug') slug: string) : Promise<CategoryResponseDto> {
        return await this.categoriesService.findBySlug(slug);
    }



    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update category by Id - ADMINS ONLY' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'Category updated successfully',
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Category with given id not Found'
    })
    @ApiResponse({
        status: 409,
        description: 'Category with given slug already exists'
    })
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) : Promise<CategoryResponseDto> {
        return await this.categoriesService.update(id, updateCategoryDto);
    }



    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete category by Id' })
    @ApiResponse({
        status: 400,
        description: 'Cannot delete category with products'
    })
    @ApiResponse({
        status: 404,
        description: 'Category not Found'
    })
    async deleteCategory(@Param('id') id: string) : Promise<{message: string}> {
        return await this.categoriesService.remove(id);
    }


}
