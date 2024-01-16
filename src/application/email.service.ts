import { emailManager } from '../managers/email-manager';

export class EmailService {
  async doOperation(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    return await emailManager.sendPasswordRecoveryMessage(
      email,
      subject,
      message,
    );
  }
}
