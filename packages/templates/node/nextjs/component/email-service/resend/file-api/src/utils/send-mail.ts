import env from "@/configs/env";
import { resend } from "@/configs/resend";

type sendMail = {
  from?: string;
  subject: string;
  data: Record<string, any>;
  email: string;
  html: string;
};

export async function sendEmail({ from, email, subject, html }: sendMail) {
  const response = await resend.emails.send({
    from: from || `<${env.EMAIL_FROM}>`,
    to: email,
    subject,
    replyTo: email,
    html
  });

  if (response.error) {
    throw new Error(response.error.message || "Failed to send email");
  }

  return response.data;
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
