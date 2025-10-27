import { z } from "zod";
import { isAddress } from "viem";

export const claimSchema = z.object({
  contractAddress: z
    .string()
    .min(1, "Contract address is required")
    .refine((val) => isAddress(val), {
      message: "Invalid contract address",
    }),

  yourMove: z.number().min(1, "Please select your move").max(5, "Invalid move selection"),
});

export type ClaimInput = z.infer<typeof claimSchema>;
