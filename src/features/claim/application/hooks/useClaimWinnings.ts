import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useEffect } from "react";
import { isAddress } from "viem";
import { useClaimStore } from "../store/useClaimStore";
import { ClaimService } from "../../infrastructure/services/claim.service";
import { claimSchema } from "../../domain/schemas/claim.schema";

export function useClaimWinnings() {
  const { address } = useAccount();
  const {
    contractAddress,
    yourMove,
    contractGameData,
    revealResult,
    isLoading,
    isFetchingGameData,
    validationErrors,
    error,
    setContractAddress,
    setYourMove,
    setContractGameData,
    setRevealResult,
    setIsLoading,
    setIsFetchingGameData,
    setValidationErrors,
    setError,
    resetForm,
  } = useClaimStore();

  // Auto-fetch contract data when contract address changes
  useEffect(() => {
    const fetchData = async () => {
      if (!contractAddress || !isAddress(contractAddress)) {
        setContractGameData(null);
        return;
      }

      setIsFetchingGameData(true);
      setError(null);

      try {
        const data = await ClaimService.fetchContractGameData(contractAddress as `0x${string}`);
        setContractGameData(data);
      } catch (err) {
        console.error("Error fetching contract data:", err);
        setError("Failed to load game data. Invalid contract address or network issue.");
        setContractGameData(null);
      } finally {
        setIsFetchingGameData(false);
      }
    };

    fetchData();
  }, [contractAddress]);

  const handleRevealMove = async () => {
    setError(null);
    setValidationErrors({});

    // Validate inputs
    const validation = claimSchema.safeParse({
      contractAddress,
      yourMove,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    if (!contractGameData) {
      setError("Please wait for game data to load");
      return;
    }

    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    // Validate user is player 1
    if (contractGameData.j1.toLowerCase() !== address.toLowerCase()) {
      setError("Only the game creator (Player 1) can reveal their move");
      return;
    }

    // Validate player 2 has played
    if (contractGameData.c2 === 0) {
      setError("Player 2 hasn't played yet");
      return;
    }

    setIsLoading(true);

    try {
      toast.loading("Revealing move...", { id: "reveal-move" });

      const result = await ClaimService.revealMove(
        contractAddress as `0x${string}`,
        yourMove!,
        contractGameData.c2
      );

      setRevealResult(result);

      const resultMessage =
        result.result === "win"
          ? `You won ${result.stake} ETH!`
          : result.result === "loss"
          ? `You lost ${result.stake} ETH`
          : `It's a draw! ${result.stake} ETH returned`;

      toast.success(resultMessage, { id: "reveal-move" });

      // Reset move selection after reveal
      setTimeout(() => {
        setYourMove(null);
      }, 3000);
    } catch (err) {
      console.error("Error revealing move:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to reveal move";
      setError(errorMessage);
      toast.error(errorMessage, { id: "reveal-move" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    contractAddress,
    yourMove,
    contractGameData,
    revealResult,
    isLoading,
    isFetchingGameData,
    validationErrors,
    error,

    // Actions
    setContractAddress,
    setYourMove,
    handleRevealMove,
    resetForm,
  };
}
