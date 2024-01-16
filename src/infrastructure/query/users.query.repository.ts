import { injectable } from 'inversify';

import { UserMongooseModel } from '../../domain/entities/user.schema';
import { queryUserValidator } from '../../shared/validators/users/queryUserValidator';
import { loginEmailFilter } from '../../shared/filters/users/loginEmailFilter';
import { skipFn } from '../../shared/utils/skipFn';
import { userMapper } from '../../shared/mappers/users/user-mapper';
import { pagesCount } from '../../shared/utils/pagesCount';
import { UserViewModel } from '../../models/user/UserViewModel';
import { UserQueryModel } from '../../models/user/UserQueryModel';
import { PaginatorUserModel } from '../../models/user/PaginatorUserModel';

@injectable()
export class UsersQueryRepository {
  async getAllUsers(data: UserQueryModel): Promise<PaginatorUserModel | null> {
    try {
      const queryData: UserQueryModel = queryUserValidator(data);

      const filter: UserQueryModel = loginEmailFilter(
        queryData.searchLoginTerm,
        queryData.searchEmailTerm,
      );

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      };

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!);

      const limit = queryData.pageSize;

      const users = await UserMongooseModel.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)
        .lean();

      const userItems: UserViewModel[] = users.map((u) => userMapper(u));

      const totalCount = await UserMongooseModel.countDocuments(filter);

      return {
        pagesCount: pagesCount(totalCount, queryData.pageSize!),
        page: queryData.pageNumber!,
        pageSize: queryData.pageSize!,
        totalCount: totalCount,
        items: userItems,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
