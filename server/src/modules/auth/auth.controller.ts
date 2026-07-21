import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}




    // ------------------------- REGISTER USER ROUTE -----------------------------
    @Post('register')
    @HttpCode(201)
    @ApiOperation({
        summary: "Register a new user",
        description: "Creates a new user account."
    })
    @ApiResponse({
        status: 201,
        description: "User registered successfully",
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: "Bad Request. Validation failed or user already registered with this email",
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error. Error registering user",
    })
    @ApiResponse({
        status: 429,
        description: "Too Many Requests. Rate limit exceeded",
    })
    async register(@Body() registerDto : RegisterDto) : Promise<AuthResponseDto> {
        return await this.authService.register(registerDto);
    }







    // ------------------------------ REFRESH TOKEN ROUTE -------------------------------------
    @UseGuards(RefreshTokenGuard)
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('JWT-refresh')
    @ApiOperation({
        summary: "Refresh access token",
        description: "Refreshes the access token using the refresh token."
    })
    @ApiResponse({
        status: 200,
        description: "Access token refreshed successfully",
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized. Invalid or expired refresh token",
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error. Error refreshing tokens",
    })
    @ApiResponse({
        status: 429,
        description: "Too Many Requests. Rate limit exceeded",
    })
    async refreshTokens(@GetUser('id') userId : string) : Promise<AuthResponseDto> {
        return await this.authService.refreshTokens(userId);
    }







    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Login",
        description: "Logs in a user and returns access and refresh tokens."
    })
    @ApiResponse({
        status: 200,
        description: "Login successful",
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized. Invalid credentials",
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error. Error logging in",
    })
    @ApiResponse({
        status: 429,
        description: "Too Many Requests. Rate limit exceeded",
    })
    async login(@Body() loginDto: LoginDto) : Promise<AuthResponseDto> {
        return await this.authService.login(loginDto);
    }


    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Logout",
        description: "Logs out a user and invalidates their refresh token."
    })
    @ApiResponse({
        status: 200,
        description: "User Logout successful",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized. User not logged in. Invalid or expired access token.",
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error. Error logging out",
    })
    @ApiResponse({
        status: 429,
        description: "Too Many Requests. Rate limit exceeded",
    })
    async logout(@GetUser('id') userId : string) : Promise<{ message: string }> {
        await this.authService.logout(userId);
        return {
            message: "Logged out successfully"
        };
    }
}
