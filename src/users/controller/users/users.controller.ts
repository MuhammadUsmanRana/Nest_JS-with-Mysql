import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
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

  @Post('/postuser')
  async createUser(@Body() user: User) {
    try {
      return await this.userServices.createUser(user);
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/getall')
  async getUsers() {
    try {
      return await this.userServices.findUsers();
    } catch (error) {
      console.error(error);
    }
  }

  @Put('/:id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ) {
    try {
      return await this.userServices.updateUser(id, user);
    } catch (error) {
      console.error(error);
    }
  }

  @Delete('/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userServices.deleteUserById(id);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('/:id/posts')
  @UseInterceptors(FileInterceptor('image'))
  async createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: Posts,
    @UploadedFile() file: any,
  ) {
    try {
      if (!file) {
        return 'image file is required';
      }
      const imageData: string = file.originalname;
      post.image = imageData;
      return await this.userServices.createUserPost(id, post);
    } catch (error) {
      console.error(error);
    }
  }

  @Delete('/:id/postdelete')
  async deleteUserPost(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userServices.deleteUserPost(id);
    } catch (error) {
      console.log(error);
    }
  }

  @Put('/:id/postupdate')
  @UseInterceptors(FileInterceptor('image'))
  async updateUserPostById(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: Posts,
    @UploadedFile() file: any,
  ) {
    try {
      if (file) {
        const imageData: string = file.originalname;
        post.image = imageData;
        return await this.userServices.updateUserPostById(id, post);
      } else {
        return 'file not exist , please select any file';
      }
    } catch (error) {
      console.error(error);
    }
  }

  @Post('/:id/profiles')
  async createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: Profile,
  ) {
    try {
      return await this.userServices.createUserProfile(id, profile);
    } catch (error) {
      console.error(error);
    }
  }

  @Put('/:id/editprofile')
  async editProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() editprofiles: Profile,
  ) {
    try {
      return await this.userServices.editProfile(id, editprofiles);
    } catch (error) {
      console.log(error);
    }
  }
}
