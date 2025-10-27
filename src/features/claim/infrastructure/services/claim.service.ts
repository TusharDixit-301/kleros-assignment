import { readContract, writeContract, waitForTransactionReceipt, simulateContract } from "wagmi/actions";
import { wagmiConfig } from "@/shared/lib/wagmiConfig";
import { RPSContractABI } from "@/shared/constants/abi";
import { ContractGameData, RevealResult } from "../../domain/types/claim.types";
import { formatEther } from "viem";
import { StorageService } from "@/features/create-game/infrastructure/services/storage.service";

export class ClaimService {
  /**
   * Fetch game data from the smart contract
   */
  static async fetchContractGameData(contractAddress: `0x${string}`): Promise<ContractGameData> {
    try {
      const [j1Data, j2Data, c2Data, stakeData] = await Promise.all([
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
          functionName: "c2",
        }),
        // @ts-expect-error - wagmi type issue with authorizationList
        readContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "stake",
        }),
      ]);

      return {
        j1: j1Data as string,
        j2: j2Data as string,
        c2: c2Data as number,
        stake: stakeData as bigint,
      };
    } catch (error) {
      console.error("Error fetching contract game data:", error);
      throw new Error("Failed to fetch game data from contract");
    }
  }

  /**
   * Calculate game result based on moves
   * Rules: Rock-Paper-Scissors-Lizard-Spock
   * 1 = Rock: defeats Scissors (3) and Lizard (5)
   * 2 = Paper: defeats Rock (1) and Spock (4)
   * 3 = Scissors: defeats Paper (2) and Lizard (5)
   * 4 = Spock: defeats Scissors (3) and Rock (1)
   * 5 = Lizard: defeats Spock (4) and Paper (2)
   */
  static calculateResult(yourMove: number, opponentMove: number): "win" | "loss" | "draw" {
    if (yourMove === opponentMove) {
      return "draw";
    }

    const winConditions: Record<number, number[]> = {
      1: [3, 5], // Rock beats Scissors and Lizard
      2: [1, 4], // Paper beats Rock and Spock
      3: [2, 5], // Scissors beats Paper and Lizard
      4: [3, 1], // Spock beats Scissors and Rock
      5: [4, 2], // Lizard beats Spock and Paper
    };

    return winConditions[yourMove]?.includes(opponentMove) ? "win" : "loss";
  }

  /**
   * Reveal move by calling solve() on the contract
   */
  static async revealMove(
    contractAddress: `0x${string}`,
    yourMove: number,
    opponentMove: number
  ): Promise<RevealResult> {
    try {
      // Retrieve game data from localStorage
      const gameData = StorageService.getGameData(contractAddress);

      if (!gameData) {
        throw new Error("Game data not found. Make sure you created this game.");
      }

      const { salt } = gameData;

      // Fetch stake amount BEFORE calling solve (as solve() will transfer the funds)
      const { stake } = await this.fetchContractGameData(contractAddress);
      const stakeInEth = formatEther(stake);

      // Simulate the transaction first to check if the move is correct
      try {
        await simulateContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "solve",
          args: [yourMove, BigInt(salt)],
        });
      } catch (simulationError) {
        // If simulation fails, it means the move is incorrect or transaction will fail
        console.error("Transaction simulation failed:", simulationError);
        throw new Error("Selected move is not correct. Please select the move you originally played.");
      }

      // Call solve function on contract
      // @ts-expect-error - wagmi type issue with chain and account
      const txHash = await writeContract(wagmiConfig, {
        address: contractAddress,
        abi: RPSContractABI,
        functionName: "solve",
        args: [yourMove, BigInt(salt)],
      });

      // Wait for transaction confirmation
      await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      // Calculate result
      const result = this.calculateResult(yourMove, opponentMove);

      return {
        contractAddress,
        yourMove,
        opponentMove,
        result,
        stake: stakeInEth,
      };
    } catch (error) {
      console.error("Error revealing move:", error);
      throw error;
    }
  }
}
