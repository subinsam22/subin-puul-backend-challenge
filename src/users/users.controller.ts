import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/common/pagination/paginated-response.interface';
import { FilterQueryDto } from './dto/filter-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all users for the user.' })
  @Get()
  async getUsers(@Query()query:FilterQueryDto):Promise<PaginatedResponse<User>>
   {
    return this.usersService.findAll(query);
    }
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The user has been successfully created.' })
  @Post("create-user")
  async create_user(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create_user(createUserDto);
  }

  
  @ApiOperation({ summary: 'Get  specific user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved specific user.' })
  @Get('user/:userId')
  async getTasksByUserId(@Param('userId') userId: string): Promise<User> {
    return this.usersService.findUserById(userId);
  }
  }

  




