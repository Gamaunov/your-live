import { Response } from 'express';
import { inject, injectable } from 'inversify';

import { EmailService } from '../application/email.service';
import { RequestWithBody } from '../shared/types/types';
import { EmailViewModel } from '../models/email/EmailViewModel';

@injectable()
export class EmailController {
  constructor(@inject(EmailService) protected emailService: EmailService) {}
  async sendEmail(req: RequestWithBody<EmailViewModel>, res: Response) {
    await this.emailService.doOperation(
      req.body.email,
      req.body.subject,
      req.body.message,
    );
    res.sendStatus(200);
  }
}
