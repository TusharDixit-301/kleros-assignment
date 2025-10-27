import { create } from "zustand";
import { GameInfo, JoinedGame } from "../../domain/types/game.types";

interface ValidationErrors {
  contractAddress?: string;
  move?: string;
  stakeAmount?: string;
}

interface JoinGameStore {
  // Form State
  contractAddress: string;
  selectedMove: number | null;
  stakeAmount: string;
  gameInfo: GameInfo | null;
  joinedGame: JoinedGame | null;

  // UI State
  isLoading: boolean;
  isFetchingGameInfo: boolean;
  validationErrors: ValidationErrors;
  error: string | null;

  // Actions
  setContractAddress: (address: string) => void;
  setSelectedMove: (move: number | null) => void;
  setStakeAmount: (amount: string) => void;
  setGameInfo: (info: GameInfo | null) => void;
  setJoinedGame: (game: JoinedGame | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsFetchingGameInfo: (fetching: boolean) => void;
  setValidationErrors: (errors: ValidationErrors) => void;
  setError: (error: string | null) => void;

  // Complex Actions
  resetForm: () => void;
  reset: () => void;
}

const initialState = {
  contractAddress: "",
  selectedMove: null,
  stakeAmount: "",
  gameInfo: null,
  joinedGame: null,
  isLoading: false,
  isFetchingGameInfo: false,
  validationErrors: {},
  error: null,
};

export const useJoinGameStore = create<JoinGameStore>((set) => ({
  ...initialState,

  setContractAddress: (address) => set({
    contractAddress: address,
    error: null,
    validationErrors: {},
  }),

  setSelectedMove: (move) => set({ selectedMove: move }),

  setStakeAmount: (amount) => set({ stakeAmount: amount }),

  setGameInfo: (info) => set({ gameInfo: info }),

  setJoinedGame: (game) => set({ joinedGame: game }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setIsFetchingGameInfo: (fetching) => set({ isFetchingGameInfo: fetching }),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  setError: (error) => set({ error }),

  resetForm: () => set(initialState),

  reset: () => set(initialState),
}));
