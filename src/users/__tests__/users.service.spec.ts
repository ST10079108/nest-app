/* eslint-disable @typescript-eslint/unbound-method */
import { Repository } from 'typeorm';
import { Role } from '../../auth/roles.enum';
import { User } from '../entities/users.entity';
import { UsersService } from '../users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const users = [
    {
      id: 1,
      username: 'user1',
      email: 'user1@test.com',
      password: 'password12345',
      role: Role.ADMIN,
      bio: '',
      avatarUrl: '',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      username: 'user2',
      email: 'user2@test.com',
      password: 'password12345',
      role: Role.USER,
      bio: '',
      avatarUrl: '',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User), // repository mock needs to provide every repository method that the service method you're testing uses.
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return all users', async () => {
      repository.find.mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
    }); // mockResolvedValue(value), "Whenever this function is called, return this value."
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      repository.findOneBy.mockResolvedValue(users[0]);

      const result = await service.findOne(1);

      expect(result).toEqual(users[0]);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('update', () => {
    it('should allow a user to update their own profile', async () => {
      repository.update.mockResolvedValue({
        affected: 1,
      } as any);

      repository.findOneBy.mockResolvedValue({
        ...users[0],
        username: 'updatedUser',
      });

      const updateDto = {
        username: 'updatedUser',
      };

      const result = await service.update(1, updateDto, {
        id: 1,
        email: 'user1@test.com',
        role: Role.USER,
      });

      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.username).toBe('updatedUser');
    });

    it('should allow an admin to update another user', async () => {
      repository.update.mockResolvedValue({
        affected: 1,
      } as any);

      repository.findOneBy.mockResolvedValue({
        ...users[1],
        username: 'updatedUser',
      });

      const updateDto = {
        username: 'updatedUser',
      };

      const result = await service.update(2, updateDto, {
        id: 1,
        email: 'user1@test.com',
        role: Role.ADMIN,
      });

      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.username).toBe('updatedUser');
    });

    it('should reject a user updating another user', async () => {
      repository.findOneBy.mockResolvedValue(users[0]);

      const updateDto = {
        username: 'updatedUser',
      };

      await expect(
        service.update(1, updateDto, {
          id: 2,
          email: 'user2@test.com',
          role: Role.USER,
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
