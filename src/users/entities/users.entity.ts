import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // describing a database table.
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    default: Role.USER,
  })
  role: Role;

  @Column()
  username: string;
}
