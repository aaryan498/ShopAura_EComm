import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, Prisma } from 'src/generated/prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

        const total = await this.prisma.category.count({ where });


        const categories = await this.prisma.category.findMany({
            where,
            skip: (page-1)*limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include : {
                _count : { 
                    select: { 
                        products: true 
                    } 
                },
            },
        })

        return {
            data: categories.map((category) => this.formatCategoryResponse(category, Number(category._count.products))),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        }
    }

    async findOne(id: string) : Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products : true },
                },
            },
        })

        if(!category) throw new NotFoundException('Category Not Found');

        return this.formatCategoryResponse(category, Number(category._count.products));
    }


    async findBySlug(slug: string) : Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: { products : true },
                },
            },
        })

        if(!category) throw new NotFoundException(`Category with slug : ${slug} Not Found`);

        return this.formatCategoryResponse(category, Number(category._count.products));
    }


    async update(id : string, updateCategoryDto: UpdateCategoryDto) : Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where : {id},
        })

        if(!category) throw new NotFoundException('Category Not Found');

        if(updateCategoryDto.slug && updateCategoryDto.slug !== category.slug){
            const existingSlug = await this.prisma.category.findUnique({
                where: {
                    slug: updateCategoryDto.slug,
                }
            })

            if(existingSlug) throw new ConflictException('Category with this slug already exists');
        }

        const updatedCategory = await this.prisma.category.update({
            where : {id},
            data: updateCategoryDto,
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        })

        return this.formatCategoryResponse(updatedCategory, Number(updatedCategory._count.products));
    }


    async remove(id: string): Promise<{ message: string }> {

        const category = await this.prisma.category.findUnique({
            where: {id},
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        })

        if(!category) throw new NotFoundException('Category Not Found');

        if(category._count.products > 0) throw new BadRequestException('Cannot delete category with products. Remove or Reassign first');

        await this.prisma.category.delete({
            where: {id},
        })

        return { message: 'Deleted Category Successfully' }
    }
}
