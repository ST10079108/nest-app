import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
/**
 * Databse already handles:
 * role - cannot submit manually, will be rejected
 * isActive
 * createdAt
 * updatedAt
 * -
 * DTO = what the user is allowed to provide
 * Entity = what database stores
 */
