import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailOptions } from './email.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.getOrThrow('RESEND_API_KEY'),
    );
    this.defaultFrom = this.configService.getOrThrow('EMAIL_FROM');
  }

  async send(options: EmailOptions): Promise<{ id: string } | null> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: options.from || this.defaultFrom,
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
      throw error;
    }
  }
}
