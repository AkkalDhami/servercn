/* eslint-disable @typescript-eslint/no-explicit-any */
import env from "../configs/env";
import { resend } from "../configs/resend";
import { renderEmailTemplates } from "./render-email-template";

export type SendMailType = {
  from?: string;
  subject: string;
  data: Record<string, any>;
  email: string;
  html?: string;
  templateName: string;
};

export async function sendEmail({
  from,
  email,
  subject,
  data,
  html,
  templateName
}: SendMailType) {
  const htmlContent =
    (await renderEmailTemplates(templateName, data)) || html || "";

  return await resend.emails.send({
    from: from || env.EMAIL_FROM,
    to: email,
    subject,
    replyTo: email,
    html: htmlContent
  });
}
