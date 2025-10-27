import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useJoinGameStore } from "../store/useJoinGameStore";
import { GameService } from "../../infrastructure/services/game.service";
import { joinGameSchema } from "../../domain/schemas/joinGame.schema";
import { isAddress } from "viem";
import { useEffect } from "react";

export function useJoinGame() {
  const { address } = useAccount();
  const {
    contractAddress,
    selectedMove,
    stakeAmount,
    gameInfo,
    joinedGame,
    isLoading,
    isFetchingGameInfo,
    validationErrors,
    error,
    setContractAddress,
    setSelectedMove,
    setStakeAmount,
    setGameInfo,
    setJoinedGame,
    setIsLoading,
    setIsFetchingGameInfo,
    setValidationErrors,
    setError,
    resetForm,
  } = useJoinGameStore();

  // Auto-fetch game info when contract address changes
  useEffect(() => {
    const fetchInfo = async () => {
      if (!contractAddress || !isAddress(contractAddress)) {
        setGameInfo(null);
        setStakeAmount("");
        return;
      }

      if (!address) {
        return;
      }

      setIsFetchingGameInfo(true);
      setError(null);

      try {
        const info = await GameService.fetchGameInfo(
          contractAddress as `0x${string}`
        );
        setGameInfo(info);
        setStakeAmount(info.stake);

        // Check if current user already joined
        const isCurrentUserPlayer2 = address === info.player2;
        const player2HasMoved = info.status === "joined";

        if (isCurrentUserPlayer2 && player2HasMoved) {
          // User already joined this game
          setJoinedGame({
            contractAddress: info.contractAddress,
            move: selectedMove || 0,
            transactionHash: "",
          });
        } else {
          setJoinedGame(null);
        }
      } catch (err) {
        console.error("Error fetching game info:", err);
        setError("Game not found or invalid contract address");
        setGameInfo(null);
        setStakeAmount("");
      } finally {
        setIsFetchingGameInfo(false);
      }
    };

    fetchInfo();
  }, [contractAddress, address]);

  const handleJoinGame = async () => {
    setError(null);
    setValidationErrors({});

    // Validate inputs
    const validation = joinGameSchema.safeParse({
      contractAddress,
      move: selectedMove,
      stakeAmount,
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

    if (!gameInfo) {
      setError("Please wait for game info to load");
      return;
    }

    if (gameInfo.status !== "waiting") {
      setError("Game is not waiting for a second player");
      return;
    }

    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    // Validate stake amount matches
    if (parseFloat(stakeAmount) !== parseFloat(gameInfo.stake)) {
      setError(`Stake amount must match the game stake: ${gameInfo.stake} ETH`);
      return;
    }

    setIsLoading(true);

    try {
      toast.loading("Joining game...", { id: "join-game" });

      const result = await GameService.joinGame(
        contractAddress as `0x${string}`,
        selectedMove!,
        stakeAmount
      );

      setJoinedGame(result);

      toast.success("Game joined successfully!", { id: "join-game" });

      // Reset selected move after successful join
      setTimeout(() => {
        setSelectedMove(null);
      }, 1000);
    } catch (err) {
      console.error("Error joining game:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to join game";
      setError(errorMessage);
      toast.error(errorMessage, { id: "join-game" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    contractAddress,
    selectedMove,
    stakeAmount,
    gameInfo,
    joinedGame,
    isLoading,
    isFetchingGameInfo,
    validationErrors,
    error,

    // Actions
    setContractAddress,
    setSelectedMove,
    setStakeAmount,
    handleJoinGame,
    resetForm,
  };
}
