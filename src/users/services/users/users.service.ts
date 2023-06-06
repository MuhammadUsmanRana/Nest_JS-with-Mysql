import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { Posts } from 'src/typeorm/entities/Post';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}
  findUsers() {
    return this.userRepository.find({ relations: ['profile', 'posts'] });
  }

  createUser(createUser: User) {
    const newUser = this.userRepository.create({
      ...createUser,
      createAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateUser: User) {
    return this.userRepository.update(id, updateUser);
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createUserProfile(
    id: number,
    profile: Profile,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'user not found, Connot create User',
        HttpStatus.BAD_REQUEST,
      );

    const newProfile = this.profileRepository.create(profile);
    const saveProfile = await this.profileRepository.save(newProfile);
    user.profile = saveProfile;
    return this.userRepository.save(user);
  }

  async createUserPost(id: number, post: Posts ) {
    const user = await this.userRepository.findOneBy({id});
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      );
    const newPost = new Posts();
      newPost.title = post.title;
      newPost.description = post.description;
      newPost.image = post.image;
      newPost.user = user;
    return this.postRepository.save(newPost);
  }
}
