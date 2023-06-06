import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { Posts } from 'src/typeorm/entities/Post';
import { User } from 'src/typeorm/entities/User';
import { Profile } from 'src/typeorm/entities/Profile';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}
  @Get()
  getUsers() {
    return this.userServices.findUsers();
  }

  @Post()
  createUser(@Body() user: User) {
    this.userServices.createUser(user);
  }

  @Put('/:id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    await this.userServices.updateUser(id, user);
  }

  @Delete('/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userServices.deleteUser(id);
  }

  @Post('/:id/profiles')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: Profile,
  ) {
    return this.userServices.createUserProfile(id, profile);
  }

  @Post('/:id/posts')
  @UseInterceptors(FileInterceptor('image'))
  async createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: Posts,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }
    const imageData: string = file.originalname;
    post.image = imageData;
    return this.userServices.createUserPost(id, post);
  }
}
