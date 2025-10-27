"use client";

import { Button } from "@/shared/components/core/button";
import { Label } from "@/shared/components/core/label";
import { MOVES } from "@/shared/constants/gameConstants";
import { Loader2 } from "lucide-react";
import { useClaimWinnings } from "../application/hooks/useClaimWinnings";

export function ClaimWinnings() {
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
    handleRevealMove,
    resetForm,
  } = useClaimWinnings();

  const getMoveLabel = (moveValue: number) => {
    const move = MOVES.find((m) => m.value === moveValue);
    return move ? `${move.label} ${move.emoji}` : "";
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "bg-green-400";
      case "loss":
        return "bg-red-400";
      case "draw":
        return "bg-yellow-400";
      default:
        return "bg-cyan-400";
    }
  };

  const getResultEmoji = (result: string) => {
    switch (result) {
      case "win":
        return "🎉";
      case "loss":
        return "😔";
      case "draw":
        return "🤝";
      default:
        return "";
    }
  };

  const getResultMessage = (result: string) => {
    switch (result) {
      case "win":
        return "You Won!";
      case "loss":
        return "You Lost";
      case "draw":
        return "It's a Draw";
      default:
        return "";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Contract Address Input */}
      <div className="flex w-full flex-col gap-1">
        <Label className="text-lg font-black uppercase text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">🎮 Game Contract</Label>
        <input
          type="text"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-xl border-4 bg-white px-4 py-2 text-black font-bold placeholder:text-gray-500 focus:shadow-[4px_4px_0px_#000000] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:outline-none disabled:opacity-50 transition-all ${
            validationErrors.contractAddress ? "border-red-500" : "border-black"
          }`}
        />
        <p className="text-xs font-bold text-white/70">Enter the contract address of the game you created</p>
        {validationErrors.contractAddress && (
          <p className="text-xs font-bold uppercase text-red-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            ⚠️ {validationErrors.contractAddress}
          </p>
        )}
      </div>

      {/* Loading Game Data */}
      {isFetchingGameData && (
        <div className="comic-border flex items-center justify-center gap-2 rounded-xl bg-blue-400 p-3">
          <Loader2 className="h-5 w-5 animate-spin text-black" />
          <p className="text-sm font-black uppercase text-black">Loading...</p>
        </div>
      )}

      {/* Game Data Display */}
      {contractGameData && !isFetchingGameData && !revealResult && (
        <div className="comic-border space-y-2 rounded-xl bg-cyan-400 p-3">
          <p className="text-lg font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">
            ✅ Game Found!
          </p>
          <div className="space-y-1 text-xs font-bold text-black">
            <p>
              <span className="text-black/70 uppercase">Player 2 Move:</span>{" "}
              {contractGameData.c2 > 0 ? getMoveLabel(contractGameData.c2) : "Not played yet"}
            </p>
            <p>
              <span className="text-black/70 uppercase">Status:</span>{" "}
              {contractGameData.c2 > 0 ? "Ready to reveal" : "Waiting for Player 2"}
            </p>
          </div>
        </div>
      )}

      {/* Your Move Selection */}
      {contractGameData && contractGameData.c2 > 0 && !revealResult && (
        <div className="w-full">
          <h2 className="mb-3 text-2xl font-black uppercase text-yellow-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)]">
            Select Your Move! ⚡
          </h2>
          <div className="space-y-2">
            {/* First Row - 3 Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {MOVES.slice(0, 3).map((move) => (
                <Button
                  key={move.value}
                  variant={yourMove === move.value ? "default" : "outline"}
                  disabled={isLoading}
                  className={`h-14 w-full rounded-xl text-base font-black uppercase transition-all duration-200 ${
                    yourMove === move.value
                      ? "bg-yellow-400 border-4 border-black text-black shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]"
                      : "border-4 border-black bg-purple-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000]"
                  }`}
                  onClick={() => setYourMove(move.value)}
                >
                  <span className="text-2xl mr-1">{move.emoji}</span>
                  {move.label}
                </Button>
              ))}
            </div>
            {/* Second Row - 2 Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {MOVES.slice(3, 5).map((move) => (
                <Button
                  key={move.value}
                  variant={yourMove === move.value ? "default" : "outline"}
                  disabled={isLoading}
                  className={`h-14 w-full rounded-xl text-base font-black uppercase transition-all duration-200 ${
                    yourMove === move.value
                      ? "bg-yellow-400 border-4 border-black text-black shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]"
                      : "border-4 border-black bg-purple-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000]"
                  }`}
                  onClick={() => setYourMove(move.value)}
                >
                  <span className="text-2xl mr-1">{move.emoji}</span>
                  {move.label}
                </Button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs font-bold text-white/70">Select the move you originally played</p>
          {validationErrors.yourMove && (
            <p className="mt-2 text-xs font-bold uppercase text-red-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
              ⚠️ {validationErrors.yourMove}
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="comic-border rounded-xl bg-red-400 p-3">
          <p className="text-sm font-black uppercase text-black">⚠️ {error}</p>
        </div>
      )}

      {/* Reveal Result */}
      {revealResult && (
        <div className={`comic-border space-y-3 rounded-xl p-4 ${getResultColor(revealResult.result)}`}>
          <div className="text-center">
            <p className="text-4xl">{getResultEmoji(revealResult.result)}</p>
            <p className="mt-2 text-xl font-black uppercase text-black drop-shadow-[3px_3px_0px_rgba(255,255,255,0.5)]">
              {getResultMessage(revealResult.result)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="comic-border rounded-xl border-black bg-white p-3 text-center">
              <p className="text-xs font-bold uppercase text-black/70">Your Move</p>
              <p className="mt-2 text-3xl">{getMoveLabel(revealResult.yourMove).split(" ")[1]}</p>
              <p className="mt-1 text-sm font-black uppercase text-black">
                {getMoveLabel(revealResult.yourMove).split(" ")[0]}
              </p>
            </div>
            <div className="comic-border rounded-xl border-black bg-white p-3 text-center">
              <p className="text-xs font-bold uppercase text-black/70">Opponent</p>
              <p className="mt-2 text-3xl">{getMoveLabel(revealResult.opponentMove).split(" ")[1]}</p>
              <p className="mt-1 text-sm font-black uppercase text-black">
                {getMoveLabel(revealResult.opponentMove).split(" ")[0]}
              </p>
            </div>
          </div>

          <div className="comic-border rounded-xl border-black bg-black p-3 text-center">
            <p className="text-sm font-black uppercase text-white">
              {revealResult.result === "win" && `🎉 You won ${revealResult.stake} ETH!`}
              {revealResult.result === "loss" && `😔 You lost ${revealResult.stake} ETH`}
              {revealResult.result === "draw" && `🤝 Draw! Your ${revealResult.stake} ETH is returned`}
            </p>
          </div>
        </div>
      )}

      {/* Reveal Move Button */}
      {contractGameData && contractGameData.c2 > 0 && !revealResult && (
        <Button
          variant="outline"
          size="lg"
          disabled={isLoading || !yourMove}
          className="flex w-full items-center justify-center rounded-xl border-4 border-black bg-yellow-500 py-3 text-lg font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000] disabled:opacity-50"
          onClick={handleRevealMove}
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="text-2xl">🎁</span>
            )}
            <span>{isLoading ? "Revealing..." : "Reveal & Claim"}</span>
          </div>
        </Button>
      )}

      {/* Reveal Another Game Button */}
      {revealResult && (
        <Button
          variant="default"
          size="lg"
          className="w-full rounded-xl border-4 border-black bg-blue-500 py-3 text-lg font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000]"
          onClick={resetForm}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎮</span>
            <span>Reveal Another Game</span>
          </div>
        </Button>
      )}
    </div>
  );
}
