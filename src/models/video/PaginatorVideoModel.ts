import { VideoViewModel } from './VideoViewModel';

export type PaginatorVideoModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: VideoViewModel[];
};
