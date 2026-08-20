import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException(
        `The email, ${registerDto.email} already exists`,
      );
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const userData = {
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
    };
    const createdUser = await this.usersService.create(userData);

    return {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
    };
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }
}
