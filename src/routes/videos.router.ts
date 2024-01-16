import { Router } from 'express';

import { container } from '../composition-root';
import { VideosController } from '../controllers/videos.controller';

export const videosRouter = Router({});
const videosController = container.resolve(VideosController);
console.log(videosController);
