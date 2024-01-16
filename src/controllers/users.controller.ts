import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/query/users.query.repository';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from '../shared/types/types';
import { UserQueryModel } from '../models/user/UserQueryModel';
import { PaginatorUserModel } from '../models/user/PaginatorUserModel';
import { CreateUserModel } from '../models/user/CreateUserModel';
import { UserViewModel } from '../models/user/UserViewModel';
import { URIParamsUserModel } from '../models/user/URIParamsUserModel';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  async getUsers(req: RequestWithQuery<UserQueryModel>, res: Response) {
    const data: UserQueryModel = req.query;

    const users: PaginatorUserModel | null =
      await this.usersQueryRepository.getAllUsers(data);

    return res.status(200).send(users);
  }

  async createUser(req: RequestWithBody<CreateUserModel>, res: Response) {
    const data: CreateUserModel = req.body;

    const newUser: UserViewModel = await this.usersService.createUser(data);

    return res.status(201).json(newUser);
  }

  async deleteUser(req: RequestWithParams<URIParamsUserModel>, res: Response) {
    const isDeleted: boolean = await this.usersService.deleteUser(
      req.params.id,
    );

    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }

  async deleteUsers(req: Request, res: Response): Promise<void> {
    const isDeleted: boolean = await this.usersService.deleteAllUsers();

    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
}
