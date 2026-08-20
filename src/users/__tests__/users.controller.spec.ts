import { Role } from '../../auth/roles.enum';
import { UsersController } from '../users.controller';
import { User } from '../entities/users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let mockedUsers: User[];
  let mockedUsersService: any;

  beforeEach(async () => {
    mockedUsers = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@test.com',
        password: 'password12345',
        role: Role.ADMIN,
      },
      {
        id: 2,
        username: 'user2',
        email: 'user2@test.com',
        password: 'password12345',
        role: Role.USER,
      },
    ];

    mockedUsersService = {
      findAll: jest.fn(() => mockedUsers),
      findOne: jest.fn((id: number) =>
        mockedUsers.find((user) => user.id === id),
      ),
      update: jest.fn((id: number, userData: Partial<User>) => {
        return {
          ...mockedUsers.find((user) => user.id === id),
          ...userData,
        };
      }),
      remove: jest.fn().mockImplementation((userID: number) => {
        const index = mockedUsers.findIndex((user) => user.id === userID);
        if (index !== -1) {
          mockedUsers.splice(index, 1);
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockedUsersService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users via controller', async () => {
    expect(await controller.findAll()).toEqual(mockedUsers);
  });

  it('should return a single user based on the id received via controller', async () => {
    expect(await controller.findOne(1)).toEqual({
      id: 1,
      username: 'user1',
      email: 'user1@test.com',
      password: 'password12345',
      role: Role.ADMIN,
    });
  });

  it('should update the specified user via controller', async () => {
    const userID = 2;
    const mockedUpdateDto = { username: 'user3' };

    const originalUser = mockedUsers.find((user) => user.id === userID);

    expect(await controller.update(2, mockedUpdateDto)).toEqual({
      ...originalUser,
      ...mockedUpdateDto,
    });
  });

  it('should delete the specified user via controller', async () => {
    expect(mockedUsers).toHaveLength(2);

    await controller.remove(2);

    expect(mockedUsers).toHaveLength(1);
    expect(mockedUsers.find((u) => u.id === 2)).toBeUndefined();
  });
});
