import { create } from "zustand";
import { CreatedGame, DeploymentStep } from "../../domain/types/game.types";

interface CreateGameStore {
  // Form state
  selectedMove: number | null;
  stakeAmount: string;
  opponentAddress: string;

  // Deployment state
  isLoading: boolean;
  deploymentStep: DeploymentStep;
  deploymentMessage: string;
  createdGame: CreatedGame | null;
  validationErrors: Record<string, string>;

  // Actions
  setSelectedMove: (move: number | null) => void;
  setStakeAmount: (amount: string) => void;
  setOpponentAddress: (address: string) => void;
  setIsLoading: (loading: boolean) => void;
  setDeploymentStep: (step: DeploymentStep) => void;
  setDeploymentMessage: (message: string) => void;
  setCreatedGame: (game: CreatedGame | null) => void;
  setValidationErrors: (errors: Record<string, string>) => void;

  // Reset all state
  reset: () => void;

  // Reset only form (for creating a new game after success)
  resetForm: () => void;
}

const initialState = {
  selectedMove: null,
  stakeAmount: "",
  opponentAddress: "",
  isLoading: false,
  deploymentStep: "idle" as DeploymentStep,
  deploymentMessage: "",
  createdGame: null,
  validationErrors: {},
};

export const useCreateGameStore = create<CreateGameStore>((set) => ({
  ...initialState,

  setSelectedMove: (move) => set({ selectedMove: move }),
  setStakeAmount: (amount) => set({ stakeAmount: amount }),
  setOpponentAddress: (address) => set({ opponentAddress: address }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setDeploymentStep: (step) => set({ deploymentStep: step }),
  setDeploymentMessage: (message) => set({ deploymentMessage: message }),
  setCreatedGame: (game) => set({ createdGame: game }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),

  // Reset everything (used when switching away or starting fresh)
  reset: () => set(initialState),

  // Reset only form data (used for "Create New Game" after success)
  resetForm: () =>
    set({
      selectedMove: null,
      stakeAmount: "",
      opponentAddress: "",
      isLoading: false,
      deploymentStep: "idle",
      deploymentMessage: "",
      createdGame: null,
      validationErrors: {},
    }),
}));
