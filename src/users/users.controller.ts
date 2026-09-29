import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RoleGuard } from '../auth/roles.guard';
import type { AuthenticatedUser } from 'src/auth/jwt.strategy';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
    @Request() req: { user: AuthenticatedUser },
  ): Promise<User> {
    return this.usersService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
