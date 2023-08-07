import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  Empty,
  PaginationDto,
  UpdateUserDto,
  User,
  Users,
} from '@app/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly users: User[] = [];

  onModuleInit(): any {
    for (let i = 0; i < 100; i++) {
      this.users.push({
        id: randomUUID(),
        name: `User ${i}`,
        password: randomUUID(),
        age: i,
        subscribed: false,
        socialMedia: {},
      });
    }
  }

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      ...createUserDto,
      subscribed: false,
      socialMedia: {},
      id: randomUUID(),
    };

    this.users.push(user);

    return user;
  }

  findAll(): Users {
    return { users: this.users };
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new Error('User not found');
    }

    this.users[index] = {
      ...this.users[index],
      ...updateUserDto,
    };

    return this.users[index];
  }

  remove(id: string): Empty {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new Error('User not found');
    }

    this.users.splice(index, 1);

    return {};
  }

  query(paginationDtoStream: Observable<PaginationDto>): Observable<Users> {
    const subject = new Subject<Users>();

    const onNext = (dto: PaginationDto) => {
      const start = dto.page * dto.skip;
      subject.next({
        users: this.users.slice(start, start + dto.skip),
      });
    };

    const onComplete = () => {
      subject.complete();
    };

    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
