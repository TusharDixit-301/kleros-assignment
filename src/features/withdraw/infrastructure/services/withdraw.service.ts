import { readContract, writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/shared/lib/wagmiConfig";
import { RPSContractABI } from "@/shared/constants/abi";
import { ContractTimeoutData, TimeoutGame } from "../../domain/types/withdraw.types";
import { formatEther } from "viem";

export class WithdrawService {
  /**
   * Fetch game timeout data from the smart contract
   */
  static async fetchContractTimeoutData(contractAddress: `0x${string}`): Promise<ContractTimeoutData> {
    try {
      const [j1Data, j2Data, stakeData, c2Data, lastActionData, timeoutData] = await Promise.all([
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
        // @ts-expect-error - wagmi type issue with authorizationList
        readContract(wagmiConfig, {
          address: contractAddress,
          abi: RPSContractABI,
          functionName: "TIMEOUT",
        }),
      ]);

      return {
        j1: j1Data as string,
        j2: j2Data as string,
        stake: stakeData as bigint,
        c2: c2Data as number,
        lastAction: lastActionData as bigint,
        timeout: timeoutData as bigint,
      };
    } catch (error) {
      console.error("Error fetching contract timeout data:", error);
      throw new Error("Failed to fetch game data from contract");
    }
  }

  /**
   * Calculate game info including timeout status
   */
  static calculateGameInfo(
    contractAddress: string,
    contractData: ContractTimeoutData,
    userAddress: string
  ): TimeoutGame {
    const player1 = contractData.j1;
    const player2 = contractData.j2 || "0x0000000000000000000000000000000000000000";
    const hasPlayer2 = player2 !== "0x0000000000000000000000000000000000000000";
    const c2Move = contractData.c2 || 0;

    // Determine game state
    let gameState: "created" | "joined" | "revealed" = "created";
    if (hasPlayer2) {
      gameState = c2Move > 0 ? "joined" : "joined";
    }

    // Calculate time remaining
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsed = currentTime - Number(contractData.lastAction);
    const timeoutSeconds = Number(contractData.timeout);
    const timeRemaining = Math.max(0, timeoutSeconds - elapsed);

    // Determine if current user can claim timeout
    const isPlayer1 = player1.toLowerCase() === userAddress.toLowerCase();
    const isPlayer2 = player2.toLowerCase() === userAddress.toLowerCase();
    const canPlayerClaim = (isPlayer1 || isPlayer2) && timeRemaining <= 0;

    return {
      contractAddress,
      player1,
      player2,
      stake: formatEther(contractData.stake),
      lastAction: contractData.lastAction,
      gameState,
      timeoutDuration: timeoutSeconds,
      timeRemaining,
      canPlayerClaim,
    };
  }

  /**
   * Claim timeout - calls j1Timeout or j2Timeout depending on player
   */
  static async claimTimeout(
    contractAddress: `0x${string}`,
    userAddress: string,
    player1Address: string,
    player2Address: string
  ): Promise<string> {
    try {
      const isPlayer1 = player1Address.toLowerCase() === userAddress.toLowerCase();
      const isPlayer2 = player2Address.toLowerCase() === userAddress.toLowerCase();

      if (!isPlayer1 && !isPlayer2) {
        throw new Error("You are not a participant in this game");
      }

      const functionName = isPlayer1 ? "j1Timeout" : "j2Timeout";

      // @ts-expect-error - wagmi type issue with chain and account
      const txHash = await writeContract(wagmiConfig, {
        address: contractAddress,
        abi: RPSContractABI,
        functionName,
        args: [],
      });

      // Wait for transaction confirmation
      await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      return txHash;
    } catch (error) {
      console.error("Error claiming timeout:", error);
      throw error;
    }
  }

  /**
   * Format address for display
   */
  static formatAddress(address: string): string {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}
