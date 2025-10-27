"use client";

import { Button } from "@/shared/components/core/button";
import { useState } from "react";

export function JoinGame() {
  const [gameId, setGameId] = useState<string>("");
  const [move, setMove] = useState<string>("");

  const moves = ["Rock", "Paper", "Scissors", "Spock", "Lizard"];

  return (
    <div className="w-full space-y-6">
      <div className="w-full">
        <h2 className="mb-4 text-lg font-medium text-white">Join Game</h2>
        <input
          type="text"
          placeholder="Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="w-full rounded-2xl border border-white/40 bg-transparent px-6 py-3 text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none"
        />
      </div>

      <div className="w-full">
        <h3 className="mb-4 text-lg font-medium text-white">Select your move</h3>
        <div className="flex flex-wrap gap-3">
          {moves.map((m) => (
            <Button
              key={m}
              variant="outline"
              className={`rounded-2xl border-white/40 px-6 text-white hover:bg-white/10 ${
                move === m ? "bg-white/20" : ""
              }`}
              onClick={() => setMove(m)}
            >
              {m}
            </Button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full rounded-2xl border-white/40 text-white hover:bg-white/10"
      >
        Join Game
      </Button>
    </div>
  );
}
