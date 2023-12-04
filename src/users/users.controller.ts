import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<User> {
    return await this.usersService.getUserById(userId);
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return await this.usersService.createUser(user);
  }

  @Put(':id')
  async changePassword(
    @Param('id') userId: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<void> {
    return await this.usersService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return await this.usersService.deleteUser(userId);
  }
}
