import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { UsersService } from '../users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const users = [
    { id: 1, username: 'user1', email: 'mail@test.com', role: 'user' },
    { id: 2, username: 'user2', email: 'mail@test.com', role: 'admin' },
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
      repository.find.mockResolvedValue(users as User[]);
      const result = await service.findAll();
      expect(result).toEqual(users);
    }); // mockResolvedValue(value), "Whenever this function is called, return this value."
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      repository.findOneBy.mockImplementation(async ({ id }) => {
        return users.find((user) => user.id === id) as User;
      }); // mockImplementation(fn), "Whenever this function is called, run this function."

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
    it('should update the user', async () => {
      repository.update.mockResolvedValue({
        affected: 1,
      } as any);

      repository.findOneBy.mockResolvedValue({
        ...users[0],
        username: 'updatedUser',
      } as User);

      const updateDto = {
        username: 'updatedUser',
      };

      const result = await service.update(1, updateDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.username).toBe('updatedUser');
    });
  });
});
