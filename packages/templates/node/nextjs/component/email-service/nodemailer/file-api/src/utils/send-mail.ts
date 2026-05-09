import env from "@/configs/env";
import { getTransporter } from "@/configs/nodemailer";

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
