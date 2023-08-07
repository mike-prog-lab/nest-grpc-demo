/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface Empty {
}

export interface Users {
  users: User[];
}

export interface PaginationDto {
  page: number;
  skip: number;
}

export interface CreateUserDto {
  name: string;
  password: string;
  age: number;
}

export interface UpdateUserDto {
  id: string;
  socialMedia: SocialMedia | undefined;
}

export interface FindOneUserDto {
  id: string;
}

export interface User {
  id: string;
  name: string;
  password: string;
  age: number;
  subscribed: boolean;
  socialMedia: SocialMedia | undefined;
}

export interface SocialMedia {
  twitterUri?: string | undefined;
  fbUri?: string | undefined;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface UserServiceClient {
  create(request: CreateUserDto): Observable<User>;

  findAll(request: Empty): Observable<Users>;

  findOne(request: FindOneUserDto): Observable<User>;

  update(request: UpdateUserDto): Observable<User>;

  remove(request: FindOneUserDto): Observable<Empty>;

  query(request: Observable<PaginationDto>): Observable<Users>;
}

export interface UserServiceController {
  create(request: CreateUserDto): Promise<User> | Observable<User> | User;

  findAll(request: Empty): Promise<Users> | Observable<Users> | Users;

  findOne(request: FindOneUserDto): Promise<User> | Observable<User> | User;

  update(request: UpdateUserDto): Promise<User> | Observable<User> | User;

  remove(request: FindOneUserDto): Promise<Empty> | Observable<Empty> | Empty;

  query(request: Observable<PaginationDto>): Observable<Users>;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "findAll", "findOne", "update", "remove"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["query"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
