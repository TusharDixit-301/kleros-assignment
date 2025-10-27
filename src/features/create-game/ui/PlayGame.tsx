"use client";

import { Button } from "@/shared/components/core/button";
import { Label } from "@/shared/components/core/label";
import CopyButton from "@/shared/components/misc/copy-button";
import { MOVES } from "@/shared/constants/gameConstants";
import { Loader2 } from "lucide-react";
import { useCreateGame } from "../application/hooks/useCreateGame";
import { useCreateGameStore } from "../application/store/useCreateGameStore";
import { DeploymentProgress } from "./components/DeploymentProgress";

export function PlayGame() {
  const { selectedMove, stakeAmount, opponentAddress, setSelectedMove, setStakeAmount, setOpponentAddress } =
    useCreateGameStore();

  const { createGame, resetForm, isLoading, deploymentStep, deploymentMessage, createdGame, validationErrors } =
    useCreateGame();

  const handleCreateGame = async () => {
    if (!selectedMove) {
      return;
    }

    await createGame({
      move: selectedMove,
      stakeAmount,
      opponentAddress,
    });
  };

  const getButtonText = () => {
    if (deploymentStep === "idle") return "Create Game";
    return deploymentMessage || "Creating Game...";
  };

  return (
    <div className="w-full space-y-4">
      {/* Select Move Section */}
      <div className="w-full">
        <h2 className="mb-3 text-2xl font-black text-yellow-400 uppercase drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)]">
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
                    ? "translate-x-[-2px] translate-y-[-2px] border-4 border-black bg-yellow-400 text-black shadow-[4px_4px_0px_#000000]"
                    : "border-4 border-black bg-blue-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000]"
                }`}
                onClick={() => setSelectedMove(move.value)}
              >
                <span className="mr-1 text-2xl">{move.emoji}</span>
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
                    ? "translate-x-[-2px] translate-y-[-2px] border-4 border-black bg-yellow-400 text-black shadow-[4px_4px_0px_#000000]"
                    : "border-4 border-black bg-blue-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000]"
                }`}
                onClick={() => setSelectedMove(move.value)}
              >
                <span className="mr-1 text-2xl">{move.emoji}</span>
                {move.label}
              </Button>
            ))}
          </div>
        </div>
        {validationErrors.move && (
          <p className="mt-2 text-sm font-bold text-red-400 uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            ⚠️ {validationErrors.move}
          </p>
        )}
      </div>

      {/* Stake Amount Input */}
      <div className="flex w-full flex-col gap-1">
        <Label className="text-lg font-black text-yellow-400 uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          💎 Stake Amount
        </Label>
        <input
          type="text"
          placeholder="Stake amount minimum 0.0001"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-xl border-4 bg-white px-4 py-2 font-bold text-black transition-all placeholder:text-gray-500 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_#000000] focus:outline-none disabled:opacity-50 ${
            validationErrors.stakeAmount ? "border-red-500" : "border-black"
          }`}
        />
        {validationErrors.stakeAmount && (
          <p className="mt-1 text-xs font-bold text-red-400 uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            ⚠️ {validationErrors.stakeAmount}
          </p>
        )}
      </div>

      {/* Opponent Address Input */}
      <div className="flex w-full flex-col gap-1">
        <Label className="text-lg font-black text-yellow-400 uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          🎯 Opponent Address
        </Label>
        <input
          type="text"
          placeholder="0xOpponentAddress"
          value={opponentAddress}
          onChange={(e) => setOpponentAddress(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-xl border-4 bg-white px-4 py-2 font-bold text-black transition-all placeholder:text-gray-500 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_#000000] focus:outline-none disabled:opacity-50 ${
            validationErrors.opponentAddress ? "border-red-500" : "border-black"
          }`}
        />
        {validationErrors.opponentAddress && (
          <p className="mt-1 text-xs font-bold text-red-400 uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            ⚠️ {validationErrors.opponentAddress}
          </p>
        )}
      </div>

      {/* Create Game / Create New Game Button */}
      {createdGame ? (
        <Button
          variant="default"
          size="lg"
          className="w-full items-center rounded-xl border-4 border-black bg-green-500 py-3 text-center text-lg font-black tracking-wide text-white uppercase shadow-[6px_6px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000]"
          onClick={resetForm}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎮</span>
            <span>Start New Game</span>
          </div>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="lg"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl border-4 border-black bg-red-500 py-3 text-lg font-black tracking-wide text-white uppercase shadow-[6px_6px_0px_#000000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000] disabled:opacity-50"
          onClick={handleCreateGame}
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="text-2xl">🚀</span>}
            <span>{getButtonText()}</span>
          </div>
        </Button>
      )}

      {/* Deployment Progress */}
      {(isLoading || deploymentStep === "completed") && (
        <DeploymentProgress
          currentStep={deploymentStep}
          message={deploymentMessage}
        />
      )}

      {/* Success Message */}
      {createdGame && (
        <div className="comic-border w-full space-y-2 rounded-xl bg-green-400 p-4">
          <h3 className="mb-1 text-xl font-black text-black uppercase drop-shadow-[3px_3px_0px_rgba(255,255,255,0.5)]">
            🎉 Boom! Game Created!
          </h3>
          <div className="space-y-1 text-xs font-bold">
            <p>
              <span className="text-black/70 uppercase">Contract Address:</span>
              <br />
              <span className="flex items-center gap-2 text-center font-mono break-all text-black">
                {createdGame.contractAddress} <CopyButton textToCopy={createdGame.contractAddress} />
              </span>
            </p>
            <p>
              <span className="text-black/70 uppercase">Transaction Hash:</span>
              <br />
              <span className="font-mono break-all text-black">{createdGame.transactionHash}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
