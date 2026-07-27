import { Controller, Get, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ModerateThrottle } from 'src/common/decorators/custom-throttler.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CartApiResponseDto, CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Carts')
@UseGuards(JwtAuthGuard, RolesGuard)
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
        return await this.cartsService.getCurrentUserCart(userId);
    }


    // @Get('user/all')
    // @ModerateThrottle()
    // @ApiOperation({
    //     summary: 'User get their cart history',
    //     description: 'Returns the authenticated users cart history.'
    // })
    // @ApiOkResponse({
    //     description: 'User get their cart history',
    //     type: CartApiResponseDto,
    // })
    // @ApiForbiddenResponse({
    //     description: 'Not Authenticated or Admin access required'
    // })
    

    

}
