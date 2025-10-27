import { z } from "zod";
import { isAddress } from "viem";

export const joinGameSchema = z.object({
  contractAddress: z
    .string()
    .min(1, "Contract address is required")
    .refine((val) => isAddress(val), {
      message: "Invalid contract address",
    }),

  move: z.number().min(1, "Please select a move").max(5, "Invalid move selection"),

  stakeAmount: z.string().min(1, "Stake amount is required"),
});

export type JoinGameInput = z.infer<typeof joinGameSchema>;
