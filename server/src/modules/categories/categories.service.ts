import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, Prisma } from 'src/generated/prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {

    constructor(private prisma: PrismaService){}

    private formatCategoryResponse(category : Category, productCount : number) : CategoryResponseDto {
        return {
            id : category.id,
            name : category.name,
            description : category.description,
            slug : category.slug,
            imageUrl : category.imageUrl,
            isActive : category.isActive,
            productCount,
            createdAt : category.createdAt,
            updatedAt : category.updatedAt
        }
    }
        


    async createCategory(createCategoryDto: CreateCategoryDto) : Promise<CategoryResponseDto> {
        const { name, description, slug, imageUrl, isActive } = createCategoryDto;

        const categorySlug = slug ?? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

        

        const existingCategory = await this.prisma.category.findUnique({
            where: { slug: categorySlug }
        })

        if(existingCategory) throw new ConflictException('Category with this slug already exists');

        const category = await this.prisma.category.create({
            data: {
                name,
                slug : categorySlug,
                description,
                imageUrl,
                isActive
            },
        })

        return this.formatCategoryResponse(category, 0);
    }


    async findAll(queryDto: QueryCategoryDto) : Promise<{
        data : CategoryResponseDto[],
        meta : { total: number, page: number, limit: number, totalPages: number }
    }> {
        const { isActive, search, page=1, limit=10 } =queryDto;

        const where : Prisma.CategoryWhereInput = {};

        if(isActive !== undefined) where.isActive = isActive;

        if(search) {
            where.OR =[
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

    }
}
