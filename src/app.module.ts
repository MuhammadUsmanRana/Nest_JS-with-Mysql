import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/Profile';
import { Posts } from './typeorm/entities/Post';
// import { UploadController } from './multer/backend.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,  
      username: 'root',
      password: '',
      database: 'nestjs_mysql_tutorial',
      entities: [User, Profile, Posts],
      synchronize: true,
    }),
    UsersModule,
  ],  

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
