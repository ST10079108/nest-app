// import { UsersService } from '../users.service';
// import { UsersController } from '../users.controller';
// import { User } from '../users.model';

// describe('UsersConroller', () => {
//   let usersController: UsersController;
//   let usersService: UsersService;

//   beforeEach(() => {
//     usersService = new UsersService();
//     usersController = new UsersController(usersService);
//   });

//   describe('findAll', () => {
//     it('should return an array of users', () => {
//       const mockedUsers: User[] = [
//         {
//           id: 1,
//           email: 'test1@mail.com',
//           password: '12345',
//         },
//         {
//           id: 2,
//           email: 'test2@mail.com',
//           password: '1234',
//         },
//         {
//           id: 3,
//           email: 'test3@mail.com',
//           password: '123',
//         },
//       ];
//       jest.spyOn(usersService, 'findAll').mockImplementation(() => mockedUsers);

//       expect(usersController.findAll()).toBe(mockedUsers);
//       expect(mockedUsers).toHaveLength(3);
//     });

//     describe('findOne', () => {
//       it('Should return a single user', () => {
//         const mockedUsers: User[] = [
//           {
//             id: 1,
//             email: 'tes1@mail.com',
//             password: '12345',
//           },
//           {
//             id: 2,
//             email: 'test2@mail.com',
//             password: '1234',
//           },
//           {
//             id: 3,
//             email: 'test3@mail.com',
//             password: '123',
//           },
//         ];

//         // jest
//         //   .spyOn(usersService, 'findOne')
//         //   .mockImplementation();
//       });
//     });
//   });
// });
import { Test } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User } from '../users.model';

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const mockedUsers: User[] = [
        {
          id: 1,
          email: 'test1@mail.com',
          password: '12345',
        },
        {
          id: 2,
          email: 'test2@mail.com',
          password: '1234',
        },
        {
          id: 3,
          email: 'test3@mail.com',
          password: '123',
        },
      ];

      jest.spyOn(usersService, 'findAll').mockImplementation(() => mockedUsers);

      const result = usersController.findAll();
      expect(result).toEqual(mockedUsers);
      expect(result).toHaveLength(3);
    });
  });

  describe('findOne', () => {
    it('Should return the requested user', () => {
      const mockedUsers: User[] = [
        {
          id: 1,
          email: 'test1@mail.com',
          password: '12345',
        },
        {
          id: 2,
          email: 'test2@mail.com',
          password: '1234',
        },
        {
          id: 3,
          email: 'test3@mail.com',
          password: '123',
        },
      ];

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation((id) => mockedUsers.find((user) => user.id === id));
      expect(usersController.findOne(1)).toBe(mockedUsers[0]);
    });
  });
});
