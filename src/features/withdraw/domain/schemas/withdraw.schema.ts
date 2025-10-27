import { z } from "zod";
import { isAddress } from "viem";

export const withdrawSchema = z.object({
  contractAddress: z
    .string()
    .min(1, "Contract address is required")
    .refine((val) => isAddress(val), {
      message: "Invalid contract address",
    }),
});

export type WithdrawInput = z.infer<typeof withdrawSchema>;
