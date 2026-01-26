import env from "../configs/env";
import { getTransporter } from "../configs/nodemailer";
import { ApiError } from "../errors/api-error";

type sendMail = {
  from?: string;
  subject: string;
  html: string;
  email: string;
};

export async function sendEmail({ from, email, subject, html }: sendMail) {
  const transporter = getTransporter();
  return transporter
    .sendMail({
      from: from || `<${env.EMAIL_FROM}>`,
      to: email,
      subject,
      html
    })
    .catch(err => {
      throw ApiError.badRequest("Failed to send email");
    });
}
