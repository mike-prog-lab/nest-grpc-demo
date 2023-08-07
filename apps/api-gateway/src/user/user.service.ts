import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  PaginationDto,
  UpdateUserDto,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE } from './constants';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private userServiceClient: UserServiceClient;
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.userServiceClient =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.userServiceClient.create(createUserDto);
  }

  findAll() {
    return this.userServiceClient.findAll({});
  }

  findOne(id: string) {
    return this.userServiceClient.findOne({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userServiceClient.update({ id, ...updateUserDto });
  }

  remove(id: string) {
    return this.userServiceClient.remove({ id });
  }

  emailUsers() {
    const users$ = new ReplaySubject<PaginationDto>();

    users$.next({ page: 0, skip: 25 });
    users$.next({ page: 1, skip: 25 });
    users$.next({ page: 2, skip: 25 });
    users$.next({ page: 3, skip: 25 });

    users$.complete();

    let chunkNumber = 1;

    this.userServiceClient.query(users$).subscribe((users) => {
      console.log('Chunk ' + chunkNumber++, users);
    });
  }
}
