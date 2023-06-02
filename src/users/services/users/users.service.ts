import { CreateUserProfileDto } from './../../dtos/CreateUserProfile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, CreateUserPostParams, updateUserParams } from 'src/utils/type';
import { Repository } from 'typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { Post } from 'src/typeorm/entities/Post';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,


  ) {}
  findUsers() {
    return this.userRepository.find({ relations: ['profile', 'posts'] });
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateuserDetails: updateUserParams) {
    return this.userRepository.update(id, updateuserDetails);
  }  

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createUserProfile(
    id: number,
    createUserProfilDto: CreateUserProfileDto,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'user not found, Connot create User',
        HttpStatus.BAD_REQUEST,
      );

      const newProfile = this.profileRepository.create(createUserProfilDto)
      const saveProfile = await this.profileRepository.save(newProfile)
      user.profile = saveProfile
      return this.userRepository.save(user)
  }

  async createUserPost(
    id: number,
    createUserPostDetails: CreateUserPostParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      ); 
    const newPost = this.postRepository.create({
      ...createUserPostDetails,
      user,
    });
    return this.postRepository.save(newPost);
  }}
