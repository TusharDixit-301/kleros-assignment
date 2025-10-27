import { z } from "zod";
import { isAddress } from "viem";

export const createGameSchema = z.object({
  move: z
    .number()
    .min(1, "Please select a move")
    .max(5, "Invalid move selection"),

  stakeAmount: z
    .string()
    .min(1, "Stake amount is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0.0001;
      },
      { message: "Minimum stake amount is 0.0001 ETH" }
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num <= 100;
      },
      { message: "Maximum stake amount is 100 ETH" }
    ),

  opponentAddress: z
    .string()
    .min(1, "Opponent address is required")
    .refine(
      (val) => isAddress(val),
      { message: "Invalid Ethereum address" }
    ),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
