import { MailtrapClient } from "mailtrap";
import env from "./env";

export const mailtrap = new MailtrapClient({
  token: env.MAILTRAP_API_KEY
});
