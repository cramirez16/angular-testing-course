import { Injectable } from '@angular/core';
import { UserInterface } from '../types/user.interface';
import { BehaviorSubject } from 'rxjs';
// import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // utilsService: UtilsService = inject(UtilsService);
  // users: UserInterface[] = [];
  users$ = new BehaviorSubject<UserInterface[]>([]);

  constructor() {}

  addUser(user: UserInterface): void {
    this.users$.next([...this.users$.getValue(), user]);
  }

  removeUser(userId: string): void {
    const updatedUsers = this.users$
      .getValue()
      .filter((user) => userId !== user.id);
    this.users$.next(updatedUsers);
  }

  // getUserNames(): string[] {
  //   return this.utilsService.pluck(this.users, 'name');
  // }
}
