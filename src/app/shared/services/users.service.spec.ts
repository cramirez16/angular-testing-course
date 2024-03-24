import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { UserInterface } from '../types/user.interface';
import { UtilsService } from './utils.service';

describe('UsersService', () => {
  let usersService: UsersService;
  const utilsServiceMock = {
    pluck: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    });
    usersService = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(usersService).toBeTruthy();
  });

  describe('addUser', () => {
    it('should add a user', () => {
      const user: UserInterface = {
        id: '3',
        name: 'foo',
      };
      usersService.addUser(user);
      expect(usersService.users).toEqual([
        {
          id: '3',
          name: 'foo',
        },
      ]);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', () => {
      usersService.users = [{ id: '3', name: 'foo' }];
      usersService.removeUser('3');
      expect(usersService.users).toEqual([]);
    });
  });

  describe('getUserNames', () => {
    it('should return foo', () => {
      // usersService.users = [{ id: '3', name: 'foo' }];
      utilsServiceMock.pluck.mockReturnValue(['foo']);
      expect(usersService.getUserNames()).toEqual(['foo']);
    });
  });
});
