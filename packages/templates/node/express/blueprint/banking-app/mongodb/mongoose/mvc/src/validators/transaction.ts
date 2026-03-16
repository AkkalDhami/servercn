import z from "zod";

export const createTransactionSchema = z.object({
  fromAccountId: z.string().nonoptional({
    message: "fromAccountId is required"
  }),
  toAccountId: z.string().nonoptional({
    message: "toAccountId is required"
  }),
  amount: z.number().positive({
    message: "amount must be positive"
  }),
  idempotencyKey: z.string().nonoptional({
    message: "Idempotency-key is required"
  })
});

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;
