import env from "@/configs/env";

import { mailtrap } from "@/configs/mailtrap";

type sendMail = {
  from?: string;
  subject: string;
  data: Record<string, any>;
  email: string;
  html: string;
};

export async function sendEmail({ from, email, subject, html }: sendMail) {
  const htmlContent = html || "";
  try {
    await mailtrap.send({
      from: {
        email: from || env.EMAIL_FROM
      },
      to: [{ email }],
      subject,
      html: htmlContent
    });
  } catch (error) {
    throw error;
  }
}
/**
 * ? Usage:
const html = `
  <h1>Reset Your Password</h1>
  <p>Click <a href="https://example.com/reset">here</a> to reset your password.</p>
`;

await sendEmail({
  email: "john.doe@example.com",
  subject: "Reset Your Password",
  html,
  from: "Servercn <servercn@example.com>"
});
 */
