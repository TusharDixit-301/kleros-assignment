"use client";

import { Button } from "@/shared/components/core/button";
import { useTabStore } from "@/shared/store/useTabStore";

export function TabSelector() {
  const { activeTab, setActiveTab } = useTabStore();

  const getButtonClass = (tab: string, bgColor: string) => {
    const isActive = activeTab === tab;
    return `w-full rounded-xl font-black text-lg uppercase transition-all duration-200 ${
      isActive
        ? `${bgColor} border-4 border-black text-white shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]`
        : "border-4 border-black bg-gray-700 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000]"
    }`;
  };

  return (
    <div className="comic-border-thick flex h-full w-full flex-col rounded-2xl bg-gradient-to-b from-purple-800 to-purple-900 p-4">
      {/* Main Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          className={getButtonClass("play", "bg-blue-500")}
          onClick={() => setActiveTab("play")}
        >
          <span className="text-2xl mr-2">🎮</span> Play
        </Button>

        <Button
          variant="outline"
          size="lg"
          className={getButtonClass("join", "bg-green-500")}
          onClick={() => setActiveTab("join")}
        >
          <span className="text-2xl mr-2">🤝</span> Join
        </Button>

        <Button
          variant="outline"
          size="lg"
          className={getButtonClass("claim", "bg-yellow-500")}
          onClick={() => setActiveTab("claim")}
        >
          <span className="text-2xl mr-2">🎁</span> Claim
        </Button>

        <Button
          variant="outline"
          size="lg"
          className={getButtonClass("withdraw", "bg-red-500")}
          onClick={() => setActiveTab("withdraw")}
        >
          <span className="text-2xl mr-2">💰</span> Withdraw
        </Button>
      </div>

      {/* Spacer to push Rules button to bottom */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="my-4 h-2 w-full border-y-4 border-black bg-yellow-400" />

      {/* Rules Button */}
      <Button
        variant="outline"
        size="lg"
        className={getButtonClass("rules", "bg-purple-500")}
        onClick={() => setActiveTab("rules")}
      >
        <span className="text-2xl mr-2">📜</span> Rules
      </Button>
    </div>
  );
}
