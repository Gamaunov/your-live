import { ObjectId } from 'mongodb';

export class VideoDBModel {
  constructor(
    public _id: ObjectId,
    public total: number,
    public items: {
      url: string;
      name: number;
      site: string;
    },
  ) {}
}
