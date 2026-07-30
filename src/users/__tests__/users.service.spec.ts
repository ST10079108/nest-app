import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Test } from '@nestjs/testing';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('Create', () => {
    it('creates a new user', () => {
      const user = usersService.create({
        email: 'testingService@mail.com',
        password: '123456',
      });

      expect(user?.email).toBe('testingService@mail.com');
      expect(user?.id).toBe(3);
    });
  });

  describe('Update', () => {
    it('Updates the specified users fields', () => {
      const updatedUser = usersService.update(2, {
        email: 'testingUpdate@mail.com',
      });

      expect(updatedUser?.email).toBe('testingUpdate@mail.com');
    });
    it('Returns undefined when user doesnt exist', () => {
      expect(usersService.update(100, {})).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('Removes the specified user', () => {
      usersService.remove(1);
      expect(usersService.findOne(1)).toBeUndefined();
    });
  });
});
