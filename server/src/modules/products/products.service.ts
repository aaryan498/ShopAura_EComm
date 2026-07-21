import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

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

}
