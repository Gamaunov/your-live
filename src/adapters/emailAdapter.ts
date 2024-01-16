import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const emailAdapter = {
  async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    async function main() {
      return await transporter.sendMail({
        from: '"Backend" <process.env.EMAIL>',
        to: email,
        subject: subject,
        html: message,
      });
    }

    main().catch(console.error);
  },
};
