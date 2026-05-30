import Stripe from "stripe";
import { env } from "../configs/env";

export const verifyWebhook = (
  payload: string | Buffer,
  signature: string
) => {
  const stripe = new Stripe(
    env.STRIPE_SECRET_KEY
  );

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
};