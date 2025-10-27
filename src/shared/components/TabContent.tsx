"use client";

import { PlayGame } from "@/features/create-game/ui/PlayGame";
import { JoinGame } from "@/features/join-game/ui/JoinGame";
import { ClaimWinnings } from "@/features/claim/ui/ClaimWinnings";
import { WithdrawFunds } from "@/features/withdraw/ui/WithdrawFunds";
import { GameRules } from "@/features/rules/GameRules";
import { useTabStore } from "@/shared/store/useTabStore";

export function TabContent() {
  const { activeTab } = useTabStore();

  const renderContent = () => {
    switch (activeTab) {
      case "play":
        return <PlayGame />;
      case "join":
        return <JoinGame />;
      case "claim":
        return <ClaimWinnings />;
      case "withdraw":
        return <WithdrawFunds />;
      case "rules":
        return <GameRules />;
      default:
        return <PlayGame />;
    }
  };

  return (
    <div className="comic-border-thick flex h-full w-full flex-col rounded-2xl bg-gradient-to-br from-indigo-800 to-purple-900 p-4 lg:p-5">
      {renderContent()}
    </div>
  );
}
