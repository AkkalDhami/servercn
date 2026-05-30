import { stripe } from "../configs/stripe";

export const createCheckoutSession =
  async () => {
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Plan",
            },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:3000/success",
      cancel_url:
        "http://localhost:3000/cancel",
    });
  };