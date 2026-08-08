import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ModerateThrottle } from 'src/common/decorators/custom-throttler.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CartApiResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateCartProductQuantityDto } from './dto/update-cart.dto';

@ApiTags('Carts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('carts')
export class CartsController {

    constructor( private readonly cartsService : CartsService ) {}


    @Get()
    @ModerateThrottle()
    @ApiOperation({
        summary: 'User Get their current cart',
        description: 'Returns the authenticated users active cart (checkoutCompleted = false).'
    })
    @ApiOkResponse({
        description: 'User Get their current cart',
        type: CartApiResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Not Authenticated - User Not found'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async getCurrentUserCart( @GetUser('id') userId: string ) : Promise<CartApiResponseDto<CartResponseDto>> {
        return await this.cartsService.getCurrentCart(userId);
    }


    @Get('me/all')
    @ModerateThrottle()
    @ApiOperation({
        summary: 'User get their cart history',
        description: 'Returns the authenticated users cart history.'
    })
    @ApiOkResponse({
        description: 'User get their cart history',
        type: CartApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated - access required'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async getCurrentUserCartHistory( @GetUser('id') userId: string ) : Promise<{
        success: boolean,
        data: CartResponseDto[],
        message: string,
    }> {
        return await this.cartsService.getAllCart(userId);
    }



    @Get('all')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ModerateThrottle()
    @ApiOperation({
        summary: 'Admin get all users cart history',
        description: 'Returns the authenticated users cart history.'
    })
    @ApiOkResponse({
        description: 'Admin get all users cart history',
        type: CartApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated - Admin access required'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async getAllUserCarts() : Promise<{
        success: boolean,
        data: CartResponseDto[],
        message: string,
    }> {
        return await this.cartsService.getAllCart();
    }


    @Post(':id')
    @ModerateThrottle()
    @ApiOperation({
        summary: "Add product to cart",
        description: "User Add product to their current cart",
    })
    @ApiParam({
        name: 'id',
        description: 'Product ID',
        type: String,
    })
    @ApiOkResponse({
        description: 'Add product to cart',
        type: CartApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated - User Not found'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async addProductToCart(@GetUser('id') userId: string, @Param('id') productId: string) : Promise<CartApiResponseDto<CartResponseDto>> {
        return await this.cartsService.addProduct(userId, productId);
    }



    @Patch(':id')
    @ModerateThrottle()
    @ApiOperation({
        summary: "Increase/Decrease product quantity in to cart",
        description: "User increase/decrease product quantity into their current cart",
    })
    @ApiParam({
        name: 'id',
        description: 'Product ID',
        type: String,
    })
    @ApiBody({
        type: UpdateCartProductQuantityDto,
    })
    @ApiOkResponse({
        description: 'Increased/Decreased product quantity to cart',
        type: CartApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated - User Not found'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async updateProductQuantityInCart(@GetUser('id') userId: string, @Param('id') productId: string, @Body() updateCartDto: UpdateCartProductQuantityDto) : Promise<CartApiResponseDto<CartResponseDto>> {
        return await this.cartsService.updateCartProductQuantity(userId, productId, updateCartDto);
    }


    @Delete(':id')
    @ModerateThrottle()
    @ApiOperation({
        summary: "Delete product from cart",
        description: "User delete product from their current cart",
    })
    @ApiParam({
        name: 'id',
        description: 'Product ID',
        type: String,
    })
    @ApiOkResponse({
        description: 'Delete product from cart',
        type: CartApiResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Not Authenticated - User Not found'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async deleteProductFromCart(@GetUser('id') userId: string, @Param('id') productId: string) : Promise<CartApiResponseDto<CartResponseDto>> {
        return await this.cartsService.removeProduct(userId, productId);
    }
    

}
