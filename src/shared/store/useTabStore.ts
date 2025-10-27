import { create } from "zustand";

export type TabType = "play" | "join" | "claim" | "withdraw" | "rules";

interface TabStore {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: "play",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
