"use client";

import { toast } from "sonner";
import { useAccount } from "wagmi";
import { ZodError } from "zod";
import { CreateGameInput, createGameSchema } from "../../domain/schemas/game.schema";
import { CreatedGame, DeploymentProgress } from "../../domain/types/game.types";
import { ContractService } from "../../infrastructure/services/contract.service";
import { useCreateGameStore } from "../store/useCreateGameStore";

export function useCreateGame() {
  const { address } = useAccount();
  const {
    isLoading,
    deploymentStep,
    deploymentMessage,
    createdGame,
    validationErrors,
    setIsLoading,
    setDeploymentStep,
    setDeploymentMessage,
    setCreatedGame,
    setValidationErrors,
    resetForm,
  } = useCreateGameStore();

  const validateInput = (input: CreateGameInput): boolean => {
    try {
      // Reset errors
      setValidationErrors({});

      // Validate with Zod
      createGameSchema.parse(input);

      // Additional validation: check if playing against self
      if (address && input.opponentAddress.toLowerCase() === address.toLowerCase()) {
        setValidationErrors({
          opponentAddress: "You cannot play against yourself",
        });
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleProgress = (progress: DeploymentProgress) => {
    setDeploymentStep(progress.step);
    setDeploymentMessage(progress.message);

    // Show toast for important steps
    if (progress.step === "deploying-hasher" || progress.step === "deploying-rps") {
      toast.info(progress.message);
    }
  };

  const createGame = async (input: CreateGameInput): Promise<CreatedGame | null> => {
    // Validate wallet connection
    if (!address) {
      toast.error("Please connect your wallet");
      return null;
    }

    // Validate input
    if (!validateInput(input)) {
      toast.error("Please fix the validation errors");
      return null;
    }

    setIsLoading(true);
    setDeploymentStep("idle");

    try {
      const result = await ContractService.createGame(
        address,
        input.move,
        input.stakeAmount,
        input.opponentAddress as `0x${string}`,
        handleProgress,
      );

      setCreatedGame(result);
      toast.success("🎮 Game created successfully! Share the contract address with your opponent.");

      return result;
    } catch (error) {
      console.error("Error creating game:", error);

      const errorMessage = error instanceof Error ? error.message : "Failed to create game";
      toast.error(errorMessage);

      setDeploymentStep("idle");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createGame,
    resetForm,
    isLoading,
    deploymentStep,
    deploymentMessage,
    createdGame,
    validationErrors,
  };
}
