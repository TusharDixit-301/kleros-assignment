import { parseEther } from "viem";
import { deployContract, readContract, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/shared/lib/wagmiConfig";
import { HasherContractABI, RPSContractABI } from "@/shared/constants/abi";
import { HasherContractByteCode, RPSContractByteCode } from "@/shared/constants/byteCode";
import { CreatedGame, DeploymentProgress } from "../../domain/types/game.types";
import { StorageService } from "./storage.service";

export class ContractService {
  static async generateSalt(): Promise<bigint> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const hexString =
      "0x" + Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return BigInt(hexString);
  }

  static async deployHasherContract(
    userAddress: `0x${string}`,
    onProgress: (progress: DeploymentProgress) => void
  ): Promise<`0x${string}`> {
    onProgress({
      step: "deploying-hasher",
      message: "Deploying Hasher Contract...",
    });

    const hasherTxHash = await deployContract(wagmiConfig, {
      abi: HasherContractABI,
      bytecode: HasherContractByteCode as `0x${string}`,
      account: userAddress,
      gas: BigInt(570560),
    });

    onProgress({
      step: "waiting-hasher",
      message: "Waiting for Hasher Contract confirmation...",
      txHash: hasherTxHash,
    });

    const hasherReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: hasherTxHash,
    });

    if (!hasherReceipt.contractAddress) {
      throw new Error("Failed to deploy Hasher contract");
    }

    return hasherReceipt.contractAddress;
  }

  static async generateCommitment(
    hasherAddress: `0x${string}`,
    move: number,
    salt: bigint,
    onProgress: (progress: DeploymentProgress) => void
  ): Promise<string> {
    onProgress({
      step: "generating-commitment",
      message: "Generating commitment hash...",
    });

    // @ts-expect-error - wagmi type issue with authorizationList
    const commitment = await readContract(wagmiConfig, {
      abi: HasherContractABI,
      address: hasherAddress,
      functionName: "hash",
      args: [move, salt],
    });

    return commitment as string;
  }

  static async deployRPSContract(
    userAddress: `0x${string}`,
    commitment: string,
    opponentAddress: `0x${string}`,
    stakeAmount: string,
    onProgress: (progress: DeploymentProgress) => void
  ): Promise<{ contractAddress: `0x${string}`; txHash: `0x${string}` }> {
    onProgress({
      step: "deploying-rps",
      message: "Deploying RPS Game Contract...",
    });

    const rpsTxHash = await deployContract(wagmiConfig, {
      abi: RPSContractABI,
      bytecode: RPSContractByteCode as `0x${string}`,
      account: userAddress,
      gas: BigInt(5705600),
      value: parseEther(stakeAmount),
      args: [commitment, opponentAddress],
    });

    onProgress({
      step: "waiting-rps",
      message: "Waiting for Game Contract confirmation...",
      txHash: rpsTxHash,
    });

    const rpsReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: rpsTxHash,
    });

    if (!rpsReceipt.contractAddress) {
      throw new Error("Failed to deploy RPS contract");
    }

    return {
      contractAddress: rpsReceipt.contractAddress,
      txHash: rpsTxHash,
    };
  }

  static async createGame(
    userAddress: `0x${string}`,
    move: number,
    stakeAmount: string,
    opponentAddress: `0x${string}`,
    onProgress: (progress: DeploymentProgress) => void
  ): Promise<CreatedGame> {
    try {
      // Generate salt
      const salt = await this.generateSalt();

      // Deploy Hasher Contract
      const hasherAddress = await this.deployHasherContract(userAddress, onProgress);
      console.log("Hasher deployed at:", hasherAddress);

      // Generate commitment
      const commitment = await this.generateCommitment(
        hasherAddress,
        move,
        salt,
        onProgress
      );
      console.log("Commitment hash:", commitment);

      // Deploy RPS Contract
      const { contractAddress, txHash } = await this.deployRPSContract(
        userAddress,
        commitment,
        opponentAddress,
        stakeAmount,
        onProgress
      );
      console.log("RPS Contract deployed at:", contractAddress);

      // Store game data
      onProgress({
        step: "storing-data",
        message: "Storing game data...",
      });

      StorageService.storeGameData(contractAddress, move, salt, commitment);

      onProgress({
        step: "completed",
        message: "Game created successfully!",
      });

      return {
        contractAddress,
        commitment,
        transactionHash: txHash,
      };
    } catch (error) {
      console.error("Contract deployment error:", error);
      throw error;
    }
  }
}
