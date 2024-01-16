import mongoose from 'mongoose';

import { VideoDBModel } from '../../models/db/VideoDBModel';

const videoSchema = new mongoose.Schema<VideoDBModel>({
  total: { type: Number, required: true },
  items: {
    url: { type: String, required: true },
    name: { type: String, required: true },
    site: { type: String, required: true },
  },
});

export const VideoMongooseModel = mongoose.model('videos', videoSchema);
