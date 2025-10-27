"use client";

import { Button } from "@/shared/components/core/button";

export function ClaimWinnings() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-medium text-white">Claim Winnings</h2>
        <p className="text-white/70">
          View and claim your winnings from completed games.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-white/20 p-6">
        <p className="text-center text-white/50">No games to claim</p>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full rounded-2xl border-white/40 text-white hover:bg-white/10"
      >
        Refresh Games
      </Button>
    </div>
  );
}
