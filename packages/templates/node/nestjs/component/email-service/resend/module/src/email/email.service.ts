import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailOptions, EmailConfig } from './email.interface';
import { getEmailConfig } from '../config/email.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private config: EmailConfig;

  constructor() {
    this.config = getEmailConfig();
    this.resend = new Resend(this.config.apiKey);
  }

  async send(options: EmailOptions): Promise<{ id: string } | null> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: options.from || this.config.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc
            : [options.cc]
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc
            : [options.bcc]
          : undefined,
        attachments: options.attachments,
        react: options.react,
      });

      if (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Email sent: ${data?.id}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error}`);
      throw new Error('Failed to send email');
    }
  }
}
