import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/auth/roles.enum';
import { AuthenticatedUser } from 'src/auth/jwt.strategy';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(
    userID: number,
    updateDto: UpdateUserDto,
    user: AuthenticatedUser,
  ): Promise<User> {
    await this.findOne(userID);

    const isAdmin = user.role === Role.ADMIN;
    const isOwner = user.id === userID;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only update your own profile');
    }

    await this.userRepository.update(userID, updateDto);

    return this.findOne(userID);
  }
  async remove(userID: number): Promise<void> {
    const result = await this.userRepository.delete(userID);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${userID} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
}
