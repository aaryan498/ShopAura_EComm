import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import type { RequestWithUser } from './interface/request-with-user.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
// Note above import carefully



@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {

    constructor( private readonly usersService: UsersService ) {}


    @Get('me')
    @ApiOperation({ summary: 'Get current user data' })
    @ApiResponse({
        status: 200,
        description: 'Current user data',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getMe(@Req() req: RequestWithUser) : Promise<UserResponseDto> {
        return await this.usersService.findOne(req.user.id);
    }


    // Controller function to find all users (ONLY FOR ADMINS)
    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'List of All users',
        type: [UserResponseDto],
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async findAll() : Promise<UserResponseDto[]> {
        return await this.usersService.findAll();
    }


    // Get User By ID
    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({
        status: 200,
        description: 'User data',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'User Not Found',
    })
    async findOne(@Param('id') id: string) : Promise<UserResponseDto> {
        return await this.usersService.findOne(id);
    }


    // Update Current User Details
    @Patch('me')
    @ApiOperation({ summary: 'Update current user details' })
    @ApiResponse({
        status: 200,
        description: 'Updated User data',
        type: UserResponseDto,
    })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'User Not Found',
    })
    @ApiResponse({
        status: 409,
        description: 'Email Already in use',
    })
    async updateMe( @GetUser('id') id : string, @Body() updateUserDto : UpdateUserDto ) : Promise<UserResponseDto> {
        return await this.usersService.updateUser(id, updateUserDto);
    }


    @Patch('me/password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update current user password' })
    @ApiResponse({
        status: 200,
        description: 'Password Updated Successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized, Current password is incorrect',
    })
    @ApiResponse({
        status: 404,
        description: 'User Not Found',
    })
    @ApiResponse({
        status: 409,
        description: 'Current Password and New Password cannot match',
    })
    async changePassword(@GetUser('id') id: string, @Body() changePasswordDto: ChangePasswordDto) : Promise<{ message: string }> {
        return await this.usersService.changePassword(id, changePasswordDto);
    }


    @Delete('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete current user' })
    @ApiResponse({
        status: 200,
        description: 'User Deleted Successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User Not Found',
    })
    async deleteMe(@GetUser('id') id: string) : Promise<{message : string}> {
        return await this.usersService.remove(id);
    }


    @Delete(':id')
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiResponse({
        status: 200,
        description: 'User Deleted Successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User Not Found',
    })
    async deleteUser(@Param('id') id: string) : Promise<{message : string}> {
        return await this.usersService.remove(id);
    }
    
       
    


}
