import { IsEmail, IsString, MinLength } from 'class-validator';
//  In this fashion, any route that uses the CreateUserDto will automatically enforce these validation rules.
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
