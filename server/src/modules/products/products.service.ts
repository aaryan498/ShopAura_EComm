import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

    constructor( private prisma: PrismaService ) {}

    private formatProductResponse(product: Product & { category: Category }): ProductResponseDto {
        return {
            ...product,
            price: Number(product.price),
            category: product.category.name,
        }
    }

    async create(createProductDto: CreateProductDto) : Promise<ProductResponseDto> {
        const existingSku = await this.prisma.product.findUnique({
            where: {
                sku: createProductDto.sku,
            }
        })

        if(existingSku) throw new ConflictException(`Product with SKU ${createProductDto.sku} already exists.`);

        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                price: new Prisma.Decimal(createProductDto.price),
            },
            include: {
                category: true,
            }
        })

        return this.formatProductResponse(product);
    }


    async findAll(queryDto: QueryProductDto) : Promise<{
        data: ProductResponseDto[],
        meta: {
            total: number,
            page: number,
            limit: number,
            totalPages: number,
        }
    }>{
        const { category, isActive, search, page=1, limit=10 } = queryDto;

        const where: Prisma.ProductWhereInput = {};

        if(category) where.categoryId = category;
        if(isActive !== undefined) where.isActive = isActive;
        if(search) where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description : { contains: search, mode: 'insensitive' } },
        ]

        const total = await this.prisma.product.count({ where });
        const products = await this.prisma.product.findMany({
            where,
            skip: (page-1)*limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
            },
        })

        return {
            data: products.map((product) => this.formatProductResponse(product)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        }
    }


    async findOne(id: string): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            }
        })

        if(!product) throw new NotFoundException('Product Not Found');

        return this.formatProductResponse(product);
    }


    async update(id: string, updateProductDto: UpdateProductDto) : Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        })

        if(!product) throw new NotFoundException('Product Not Found');

        if(updateProductDto && updateProductDto.sku !== product.sku){
            const skuTaken = await this.prisma.product.findUnique({
                where: { sku: updateProductDto.sku },
            })
            if(skuTaken) throw new ConflictException(`Product with SKU ${updateProductDto.sku} already exists.`);
        }

        const updateData: Prisma.ProductUpdateInput = { ...updateProductDto };
        if(updateProductDto.price !== undefined){
            updateData.price = new Prisma.Decimal(updateProductDto.price);
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
            },
        })

        return this.formatProductResponse(updatedProduct);
    }


    async updateStock(id: string, quantity: number) : Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        })

        if(!product) throw new NotFoundException('Product Not Found');

        if(product.stock + quantity < 0) throw new BadRequestException('Product stock cannot be negative');

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                stock: product.stock + quantity,
            },
            include: {
                category: true,
            },
        });

        return this.formatProductResponse(updatedProduct);
    }



    async remove(id: string): Promise<{ message: string }> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                orderItems: true,
                cartItems: true,
            }
        })

        if(!product) throw new NotFoundException('Product Not Found');

        if(product.orderItems.length > 0) throw new ConflictException('Cannot delete Product that is active in order');

        await this.prisma.product.delete({ where: { id } })


        return {
            message: 'Product Deleted Successfully',
        }

    }

}
