import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { Posts } from 'src/typeorm/entities/Post';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}

  async findUsers() {
    try {
      return await this.userRepository.find({
        relations: ['profile', 'posts'],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createUser(createUser: User) {
    try {
      const saltOrRounds = 10;
      const newUser = this.userRepository.create({
        ...createUser,
        createAt: new Date(),
      });
      const hashedPassword = await bcrypt.hash(newUser.password, saltOrRounds);
      newUser.password = hashedPassword;
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error(error);
    }
  }

  async updateUser(id: number, updateUser: User) {
    try {
      const userId = await this.userRepository.findOneBy({ id });
      const saltOrRounds = 10;
      const { password } = updateUser;
      if (userId) {
        const hashedPassword = await bcrypt.hash(
          password.toString(),
          saltOrRounds,
        );
        updateUser.password = hashedPassword;
        return (
          await this.userRepository.update(id, updateUser),
          'user has been updated'
        );
      } else {
        return 'userId not found';
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserById(id: number) {
    try {
      const userId = this.userRepository.findOneBy({ id });
      if (userId) {
        return (
          await this.userRepository.delete({ id }), 'user has been deleted'
        );
      } else {
        return 'useId not found';
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createUserPost(id: number, post: Posts) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return 'User not found. Cannot create user';
      }
      const newPost = this.postRepository.create({
        ...post,
        user,
      });
      return (
        await this.postRepository.save(newPost), 'user post has been created'
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserPost(id: number) {
    try {
      const userId = await this.postRepository.findOneBy({ id });
      if (userId) {
        return (
          await this.postRepository.delete({ id }),
          'user post has been deleted '
        );
      } else {
        return 'userId not found';
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserPostById(id: number, updatePost: Posts) {
    try {
      const { title, description, image } = updatePost;
      const existingUser = await this.postRepository.findOneBy({ id });
      if (existingUser) {
        existingUser.title = title;
        existingUser.description = description;
        existingUser.image = image;
        return (
          await this.postRepository.update(id, updatePost),
          'your post has been updated successfully'
        );
      } else {
        return 'user id not found, not updated';
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createUserProfile(id: number, profile: Profile) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return 'user not found, Connot create User';
      }
      const newProfile = await this.profileRepository.create(profile);
      const saveProfile = await this.profileRepository.save(newProfile);
      user.profile = saveProfile;
      return (
        await this.userRepository.save(user), 'user profile has been created'
      );
    } catch (error) {
      console.error(error);
    }
  }

  async editProfile(id: number, editprofile: Profile) {
    try {
      const userId = await this.profileRepository.findOneBy({ id });
      if (userId) {
        return (
          await this.profileRepository.update(id, editprofile),
          'user prifile has been updated '
        );
      } else {
        return 'userId not found';
      }
    } catch (error) {
      console.error(error);
    }
  }
}
