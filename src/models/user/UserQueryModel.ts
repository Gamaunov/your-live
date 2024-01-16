export type UserQueryModel = {
  sortBy?: string;
  sortDirection?: string | number;
  pageNumber?: number;
  pageSize?: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
