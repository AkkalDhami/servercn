import env from "../configs/env";
import { getTransporter } from "../configs/nodemailer";
import { ApiError } from "./api-error";
import { renderEmailTemplates } from "./render-template";

type sendMail = {
  from?: string;
  subject: string;
  data: Record<string, any>;
  email: string;
  templateName: string;
};

export async function sendEmail({
  from,
  email,
  subject,
  data,
  templateName
}: sendMail) {
  const transporter = getTransporter();

  const html = await renderEmailTemplates(templateName, data);
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
