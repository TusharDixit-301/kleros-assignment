"use client";

import { Button } from "@/shared/components/core/button";
import { Label } from "@/shared/components/core/label";
import { formatTimeRemaining } from "@/shared/lib/utils/formatFunctions";
import { Loader2 } from "lucide-react";
import { useWithdrawFunds } from "../application/hooks/useWithdrawFunds";
import { WithdrawService } from "../infrastructure/services/withdraw.service";

export function WithdrawFunds() {
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
    handleFetchGameInfo,
    handleClaimTimeout,
    resetForm,
  } = useWithdrawFunds();

  const canClaim = gameInfo && gameInfo.canPlayerClaim;

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
        <p className="text-xs font-bold text-white/70">Enter the contract address to check timeout status</p>
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
        <div className="comic-border space-y-3 rounded-xl bg-cyan-400 p-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">
              ⏰ Game Info
            </p>
            <span
              className={`comic-border rounded-lg border-black px-2 py-1 text-xs font-black uppercase ${
                canClaim ? "bg-red-400 text-black" : "bg-green-400 text-black"
              }`}
            >
              {canClaim ? "⚠️ Timeout" : "✅ Active"}
            </span>
          </div>

          <div className="space-y-1 text-xs font-bold text-black">
            <p>
              <span className="text-black/70 uppercase">Contract:</span>{" "}
              <span className="font-mono">{gameInfo.contractAddress.slice(0, 10)}...</span>
            </p>
            <p>
              <span className="text-black/70 uppercase">Player 1:</span>{" "}
              <span className="font-mono">{WithdrawService.formatAddress(gameInfo.player1)}</span>
            </p>
            <p>
              <span className="text-black/70 uppercase">Player 2:</span>{" "}
              <span className="font-mono">
                {gameInfo.player2 !== "0x0000000000000000000000000000000000000000"
                  ? WithdrawService.formatAddress(gameInfo.player2)
                  : "Not joined"}
              </span>
            </p>
            <p>
              <span className="text-black/70 uppercase">Stake:</span> {gameInfo.stake} ETH
            </p>
            <p>
              <span className="text-black/70 uppercase">Game State:</span>{" "}
              <span className="capitalize">{gameInfo.gameState}</span>
            </p>
          </div>

          <div className="border-t-4 border-black pt-2">
            <p className="text-sm font-black uppercase text-black">
              <span className="text-black/70">Time Left:</span>{" "}
              <span className="font-mono text-base">
                {canClaim ? "⏰ Timeout!" : formatTimeRemaining(timeRemaining)}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="comic-border rounded-xl bg-purple-400 p-3">
        <p className="text-sm font-bold text-black">
          <span className="font-black uppercase">⏱️ Timeout:</span> If your opponent doesn&apos;t respond within the timeout
          period, you can claim their stake. This protects you from abandoned games.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="comic-border rounded-xl bg-red-400 p-3">
          <p className="text-sm font-black uppercase text-black">⚠️ {error}</p>
        </div>
      )}

      {/* Success Display */}
      {claimedTimeout && (
        <div className="comic-border space-y-2 rounded-xl bg-green-400 p-4">
          <p className="text-xl font-black uppercase text-black drop-shadow-[3px_3px_0px_rgba(255,255,255,0.5)]">
            🎉 Timeout Claimed!
          </p>
          <div className="space-y-1 text-xs font-bold text-black">
            <p>
              <span className="text-black/70 uppercase">Contract:</span>
              <br />
              <span className="break-all font-mono">{claimedTimeout.contractAddress}</span>
            </p>
            <p>
              <span className="text-black/70 uppercase">Amount Claimed:</span> {claimedTimeout.amount} ETH
            </p>
          </div>
          <p className="mt-2 text-xs font-bold text-black/70">
            The opponent&apos;s stake has been transferred to your account.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleFetchGameInfo}
          disabled={isLoading || !contractAddress}
          className="flex-1 rounded-xl border-4 border-black bg-blue-500 py-2 font-black uppercase text-white shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] disabled:opacity-50"
        >
          Check Status
        </Button>
        <Button
          variant={canClaim ? "default" : "outline"}
          onClick={handleClaimTimeout}
          disabled={isLoading || !canClaim}
          className={`flex-1 rounded-xl border-4 border-black py-2 font-black uppercase shadow-[4px_4px_0px_#000000] transition-all ${
            canClaim
              ? "bg-red-500 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000]"
              : "bg-gray-600 text-white opacity-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isLoading ? "Claiming..." : "Claim Timeout"}</span>
          </div>
        </Button>
      </div>

      {/* Claim Another Game Button */}
      {claimedTimeout && (
        <Button
          variant="default"
          size="lg"
          className="w-full rounded-xl border-4 border-black bg-blue-500 py-3 text-lg font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000]"
          onClick={resetForm}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎮</span>
            <span>Claim Another Game</span>
          </div>
        </Button>
      )}
    </div>
  );
}
