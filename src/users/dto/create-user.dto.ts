import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/auth/roles.enum';
//  In this fashion, any route that uses the CreateUserDto will automatically enforce these validation rules.
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  role: Role;

  @IsString()
  @IsNotEmpty()
  username: string;
}
