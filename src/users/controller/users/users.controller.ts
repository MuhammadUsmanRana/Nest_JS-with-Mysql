import { CreateUserProfileDto } from './../../dtos/CreateUserProfile.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { createUserDto } from 'src/users/dtos/CreateUser.dtos';
import { updateUserDto } from 'src/users/dtos/updete.User.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}
  @Get()
  getUsers() {
    return this.userServices.findUsers();
  }

  @Post()
  createUser(@Body() creatUser: createUserDto) {
    this.userServices.createUser(creatUser);
  }

  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDtos: updateUserDto,
  ) {    
    await this.userServices.updateUser(id, updateUserDtos);
  }

  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userServices.deleteUser(id);
  }

  @Post(':id/profiles')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.userServices.createUserProfile(id,createUserProfileDto)
  }

  @Post(':id/posts')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserPostDto: CreateUserPostDto,
  ) {
    return this.userServices.createUserPost(id, createUserPostDto);
  }
}
  