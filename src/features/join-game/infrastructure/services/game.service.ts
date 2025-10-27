import { parseEther, formatEther } from "viem";
import { readContract, writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/shared/lib/wagmiConfig";
import { RPSContractABI } from "@/shared/constants/abi";
import { GameInfo, JoinedGame } from "../../domain/types/game.types";

export class GameService {
  static async fetchGameInfo(
    contractAddress: `0x${string}`
  ): Promise<GameInfo> {
    try {
      // Fetch all contract data in parallel
      const [j1Data, j2Data, stakeData, c2Data, lastActionData] = await Promise.all([
        // @ts-expect-error - wagmi type issue with authorizationList
        readContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "j1",
        }),
        // @ts-expect-error - wagmi type issue with authorizationList
        readContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "j2",
        }),
        // @ts-expect-error - wagmi type issue with authorizationList
        readContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "stake",
        }),
        // @ts-expect-error - wagmi type issue with authorizationList
        readContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "c2",
        }),
        // @ts-expect-error - wagmi type issue with authorizationList
        readContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "lastAction",
        }),
      ]);

      const player1 = j1Data as string;
      const player2 = (j2Data as string) || "0x0000000000000000000000000000000000000000";
      const stake = stakeData as bigint;
      const c2 = c2Data as number;
      const lastAction = lastActionData as bigint;

      const hasPlayer2 = player2 !== "0x0000000000000000000000000000000000000000";
      const player2HasMoved = c2 && c2 !== 0;

      const stakeInEth = formatEther(stake);

      // Determine game status
      let status: "waiting" | "joined" | "completed" | "error" = "waiting";

      if (hasPlayer2 && player2HasMoved) {
        status = "joined";
      } else if (hasPlayer2 && !player2HasMoved) {
        status = "waiting";
      }

      return {
        contractAddress,
        player1,
        player2,
        stake: stakeInEth,
        status,
        lastAction,
      };
    } catch (error) {
      console.error("Error fetching game info:", error);
      throw new Error("Failed to fetch game info. Invalid contract address or network issue.");
    }
  }

  static async joinGame(
    contractAddress: `0x${string}`,
    move: number,
    stakeAmount: string
  ): Promise<JoinedGame> {
    try {
      // Write to contract
      // @ts-expect-error - wagmi type issue with chain and account
      const txHash = await writeContract(wagmiConfig, {
        address: contractAddress,
        abi: RPSContractABI,
        functionName: "play",
        args: [move],
        value: parseEther(stakeAmount),
      });

      // Wait for confirmation
      await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      return {
        contractAddress,
        move,
        transactionHash: txHash,
      };
    } catch (error) {
      console.error("Error joining game:", error);
      throw error;
    }
  }

  static formatAddress(address: string): string {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}
