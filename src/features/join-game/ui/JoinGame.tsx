"use client";

import { Button } from "@/shared/components/core/button";
import { Label } from "@/shared/components/core/label";
import { MOVES } from "@/shared/constants/gameConstants";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { useJoinGame } from "../application/hooks/useJoinGame";
import { GameService } from "../infrastructure/services/game.service";

export function JoinGame() {
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
    handleJoinGame,
    resetForm,
  } = useJoinGame();

  const getMoveLabel = (moveValue: number) => {
    const move = MOVES.find((m) => m.value === moveValue);
    return move ? `${move.label} ${move.emoji}` : "";
  };

  // Check if current user is trying to join their own game
  const isOwnGame = gameInfo && address && gameInfo.player1.toLowerCase() === address.toLowerCase();

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
        <p className="text-xs font-bold text-white/70">Enter the contract address shared by Player 1</p>
        {validationErrors.contractAddress && (
          <p className="text-xs font-bold uppercase text-red-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            ⚠️ {validationErrors.contractAddress}
          </p>
        )}
      </div>

      {/* Loading Game Info */}
      {isFetchingGameInfo && (
        <div className="comic-border flex items-center justify-center gap-2 rounded-xl bg-blue-400 p-3">
          <Loader2 className="h-5 w-5 animate-spin text-black" />
          <p className="text-sm font-black uppercase text-black">Loading...</p>
        </div>
      )}

      {/* Game Info Display */}
      {gameInfo && !isFetchingGameInfo && (
        <div className="comic-border space-y-2 rounded-xl bg-cyan-400 p-3">
          <p className="text-lg font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">
            ✅ Game Found!
          </p>
          <div className="space-y-1 text-xs font-bold text-black">
            <p>
              <span className="text-black/70 uppercase">Player 1:</span>{" "}
              <span className="font-mono">{GameService.formatAddress(gameInfo.player1)}</span>
            </p>
            <p>
              <span className="text-black/70 uppercase">Stake:</span> {gameInfo.stake} ETH
            </p>
            <p>
              <span className="text-black/70 uppercase">Status:</span>{" "}
              {gameInfo.status === "waiting" ? "Waiting for Player 2" : "Already Joined"}
            </p>
          </div>
        </div>
      )}

      {/* Can't Join Own Game Warning */}
      {isOwnGame && gameInfo.status === "waiting" && !joinedGame && (
        <div className="comic-border rounded-xl bg-orange-400 p-3">
          <p className="text-sm font-black uppercase text-black">
            ⚠️ Cannot join your own game!
          </p>
        </div>
      )}

      {/* Move Selection - Only shown if game is waiting */}
      {gameInfo && gameInfo.status === "waiting" && !joinedGame && !isOwnGame && (
        <>
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
                    variant={selectedMove === move.value ? "default" : "outline"}
                    disabled={isLoading}
                    className={`h-14 w-full rounded-xl text-base font-black uppercase transition-all duration-200 ${
                      selectedMove === move.value
                        ? "bg-yellow-400 border-4 border-black text-black shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]"
                        : "border-4 border-black bg-green-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000]"
                    }`}
                    onClick={() => setSelectedMove(move.value)}
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
                    variant={selectedMove === move.value ? "default" : "outline"}
                    disabled={isLoading}
                    className={`h-14 w-full rounded-xl text-base font-black uppercase transition-all duration-200 ${
                      selectedMove === move.value
                        ? "bg-yellow-400 border-4 border-black text-black shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]"
                        : "border-4 border-black bg-green-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000]"
                    }`}
                    onClick={() => setSelectedMove(move.value)}
                  >
                    <span className="text-2xl mr-1">{move.emoji}</span>
                    {move.label}
                  </Button>
                ))}
              </div>
            </div>
            {validationErrors.move && (
              <p className="mt-2 text-xs font-bold uppercase text-red-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                ⚠️ {validationErrors.move}
              </p>
            )}
          </div>

          {/* Stake Amount Display */}
          <div className="flex w-full flex-col gap-1">
            <Label className="text-lg font-black uppercase text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">💎 Stake Amount</Label>
            <input
              type="text"
              value={stakeAmount}
              readOnly
              disabled
              className="w-full rounded-xl border-4 border-black bg-gray-200 px-4 py-2 text-black font-bold disabled:opacity-70"
            />
            <p className="text-xs font-bold text-white/70">Auto-set from game contract</p>
          </div>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="comic-border rounded-xl bg-red-400 p-3">
          <p className="text-sm font-black uppercase text-black">⚠️ {error}</p>
        </div>
      )}

      {/* Success Message */}
      {joinedGame && (
        <div className="comic-border space-y-2 rounded-xl bg-green-400 p-4">
          <p className="text-xl font-black uppercase text-black drop-shadow-[3px_3px_0px_rgba(255,255,255,0.5)]">
            🎉 Joined Successfully!
          </p>
          <div className="space-y-1 text-xs font-bold text-black">
            <p>
              <span className="text-black/70 uppercase">Contract:</span>
              <br />
              <span className="break-all font-mono">{joinedGame.contractAddress}</span>
            </p>
            <p>
              <span className="text-black/70 uppercase">Your Move:</span> {getMoveLabel(joinedGame.move)}
            </p>
            <p>
              <span className="text-black/70 uppercase">Stake:</span> {gameInfo?.stake} ETH
            </p>
          </div>
          <p className="mt-2 text-xs font-bold text-black/70">
            Waiting for Player 1 to reveal!
          </p>
        </div>
      )}

      {/* Join Game Button */}
      {gameInfo && gameInfo.status === "waiting" && !joinedGame && !isOwnGame && (
        <Button
          variant="outline"
          size="lg"
          disabled={isLoading || !selectedMove}
          className="flex w-full items-center justify-center rounded-xl border-4 border-black bg-green-500 py-3 text-lg font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000] disabled:opacity-50"
          onClick={handleJoinGame}
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="text-2xl">🤝</span>
            )}
            <span>{isLoading ? "Joining..." : "Join Game"}</span>
          </div>
        </Button>
      )}

      {/* Join Another Game Button */}
      {joinedGame && (
        <Button
          variant="default"
          size="lg"
          className="w-full rounded-xl border-4 border-black bg-blue-500 py-3 text-lg font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000]"
          onClick={resetForm}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎮</span>
            <span>Join Another Game</span>
          </div>
        </Button>
      )}

      {/* Game Already Joined Message */}
      {gameInfo && gameInfo.status === "joined" && !joinedGame && (
        <div className="comic-border rounded-xl bg-yellow-400 p-3">
          <p className="text-sm font-black uppercase text-black">
            ⚠️ Game Full! Already has 2 players!
          </p>
        </div>
      )}
    </div>
  );
}
