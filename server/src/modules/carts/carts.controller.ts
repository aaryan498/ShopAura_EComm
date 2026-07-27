import { Controller, Get, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ModerateThrottle } from 'src/common/decorators/custom-throttler.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

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
        description: 'UReturns the authenticated users active cart (checkoutCompleted = false).'
    })
    @ApiOkResponse({
        description: 'User Get their current cart',
        type: CartResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Not Authenticated - User Not found'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async getCurrentUserCart( @GetUser('id') userId: string ) : Promise<CartResponseDto> {
        return await this.cartsService.getCurrentUserCart(userId);
    }

    

}
