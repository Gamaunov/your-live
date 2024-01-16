import { Request, Response } from 'express';

export class HomeController {
  async home(req: Request, res: Response) {
    res.status(200).send('happy testing');
  }
}

export const homeController = new HomeController();
