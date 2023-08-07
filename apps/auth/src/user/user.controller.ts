import { Controller, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserServiceController,
  CreateUserDto,
  Empty,
  FindOneUserDto,
  UpdateUserDto,
  PaginationDto,
  User,
  Users,
  UserServiceControllerMethods,
} from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  private readonly users: User[] = [];

  constructor(private readonly userService: UserService) {}

  create(request: CreateUserDto): Promise<User> | Observable<User> | User {
    return this.userService.create(request);
  }

  findAll(request: Empty): Promise<Users> | Observable<Users> | Users {
    return this.userService.findAll();
  }

  findOne(request: FindOneUserDto): Promise<User> | Observable<User> | User {
    return this.userService.findOne(request.id);
  }

  query(request: Observable<PaginationDto>): Observable<Users> {
    return this.userService.query(request);
  }

  remove(request: FindOneUserDto): Promise<Empty> | Observable<Empty> | Empty {
    return this.userService.remove(request.id);
  }

  update(request: UpdateUserDto): Promise<User> | Observable<User> | User {
    return this.userService.update(request.id, request);
  }
}
