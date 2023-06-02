import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity({ name: 'user_profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()  
  lastname: string;

  @Column()
  age: number;

  @Column()
  dob: string;
}
