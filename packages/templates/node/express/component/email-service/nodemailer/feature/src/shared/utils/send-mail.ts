import env from "../configs/env";
import { getTransporter } from "../configs/nodemailer";

type sendMail = {
  from?: string;
  subject: string;
  data: Record<string, any>;
  email: string;
  html: string;
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
    .catch(() => {
      throw new Error("Failed to send email");
    });
}
