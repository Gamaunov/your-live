import { VideoDBModel } from '../../../models/db/VideoDBModel';
import { VideoViewModel } from '../../../models/video/VideoViewModel';

export const videosMapper = (video: VideoDBModel): VideoViewModel => {
  return {
    id: video._id.toString(),
    total: video.total,
    items: {
      url: video.items.url,
      name: video.items.name,
      site: video.items.site,
    },
  };
};
