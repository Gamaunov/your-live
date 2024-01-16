import { inject, injectable } from 'inversify';

import { VideosQueryRepository } from '../infrastructure/query/videos.query.repository';

@injectable()
export class VideosController {
  constructor(
    @inject(VideosQueryRepository)
    protected videosQueryRepository: VideosQueryRepository,
  ) {}
}
