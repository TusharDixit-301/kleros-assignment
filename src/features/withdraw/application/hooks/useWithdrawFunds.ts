import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useEffect } from "react";
import { useWithdrawStore } from "../store/useWithdrawStore";
import { WithdrawService } from "../../infrastructure/services/withdraw.service";
import { withdrawSchema } from "../../domain/schemas/withdraw.schema";

export function useWithdrawFunds() {
  const { address } = useAccount();
  const {
    contractAddress,
    gameInfo,
    claimedTimeout,
    timeRemaining,
    isLoading,
    isFetchingGameInfo,
    validationErrors,
    error,
    setContractAddress,
    setGameInfo,
    setClaimedTimeout,
    setTimeRemaining,
    setIsLoading,
    setIsFetchingGameInfo,
    setValidationErrors,
    setError,
    resetForm,
  } = useWithdrawStore();

  // Update time remaining every second
  useEffect(() => {
    if (!gameInfo) return;

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsed = currentTime - Number(gameInfo.lastAction);
      const remaining = Math.max(0, gameInfo.timeoutDuration - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0 && gameInfo.timeRemaining > 0) {
        // Update game info to reflect can claim
        setGameInfo({
          ...gameInfo,
          timeRemaining: 0,
          canPlayerClaim: true,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameInfo]);

  const handleFetchGameInfo = async () => {
    setError(null);
    setValidationErrors({});

    // Validate input
    const validation = withdrawSchema.safeParse({
      contractAddress,
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

    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    setIsFetchingGameInfo(true);

    try {
      const contractData = await WithdrawService.fetchContractTimeoutData(contractAddress as `0x${string}`);
      const gameData = WithdrawService.calculateGameInfo(contractAddress, contractData, address);
      setGameInfo(gameData);
      setTimeRemaining(gameData.timeRemaining);
    } catch (err) {
      console.error("Error fetching game info:", err);
      setError("Game not found or invalid contract address");
      setGameInfo(null);
    } finally {
      setIsFetchingGameInfo(false);
    }
  };

  const handleClaimTimeout = async () => {
    setError(null);

    if (!gameInfo) {
      setError("Please fetch game info first");
      return;
    }

    if (!gameInfo.canPlayerClaim) {
      setError("Timeout has not been reached yet or you are not a participant");
      return;
    }

    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    setIsLoading(true);

    try {
      toast.loading("Claiming timeout...", { id: "claim-timeout" });

      await WithdrawService.claimTimeout(
        contractAddress as `0x${string}`,
        address,
        gameInfo.player1,
        gameInfo.player2
      );

      setClaimedTimeout({
        contractAddress: gameInfo.contractAddress,
        amount: gameInfo.stake,
      });

      toast.success(`Successfully claimed ${gameInfo.stake} ETH!`, { id: "claim-timeout" });

      // Reset form after successful claim
      setTimeout(() => {
        setContractAddress("");
        setGameInfo(null);
      }, 1000);
    } catch (err) {
      console.error("Error claiming timeout:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to claim timeout";
      setError(errorMessage);
      toast.error(errorMessage, { id: "claim-timeout" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    contractAddress,
    gameInfo,
    claimedTimeout,
    timeRemaining,
    isLoading,
    isFetchingGameInfo,
    validationErrors,
    error,

    // Actions
    setContractAddress,
    handleFetchGameInfo,
    handleClaimTimeout,
    resetForm,
  };
}
