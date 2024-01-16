import { inject, injectable } from 'inversify';

import { VideosRepository } from '../videos.repository';
import { VideoDBModel } from '../../models/db/VideoDBModel';
import { VideoMongooseModel } from '../../domain/entities/video.schema';
import { VideoQueryModel } from '../../models/video/VideoQueryModel';
import { skipFn } from '../../shared/utils/skipFn';
import { pagesCount } from '../../shared/utils/pagesCount';

@injectable()
export class VideosQueryRepository {
  constructor(
    @inject(VideosRepository) protected videosRepository: VideosRepository,
  ) {}

  async findVideos(query: VideoQueryModel) {
    const skip = skipFn(query.pageNumber!, query.pageSize!);

    const limit = query.pageSize;

    const videos = await VideoMongooseModel.find()
      .skip(skip)
      .limit(limit!)
      .lean();

    const videosItems = this.videosMapping(videos);

    const totalCount = await VideoMongooseModel.countDocuments();

    return {
      pagesCount: pagesCount(totalCount, query.pageSize!),
      page: query.pageNumber!,
      pageSize: query.pageSize!,
      totalCount: totalCount,
      items: videosItems,
    };
  }
  private async videosMapping(array: VideoDBModel[]) {
    return Promise.all(
      array.map(async (video) => {
        return {
          id: video._id.toString(),
          total: video.total,
          items: {
            url: video.items.url,
            name: video.items.name,
            site: video.items.site,
          },
        };
      }),
    );
  }
}
