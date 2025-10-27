import { create } from "zustand";
import { TimeoutGame, ClaimedTimeout } from "../../domain/types/withdraw.types";

interface ValidationErrors {
  contractAddress?: string;
}

interface WithdrawStore {
  // Form State
  contractAddress: string;
  gameInfo: TimeoutGame | null;
  claimedTimeout: ClaimedTimeout | null;
  timeRemaining: number;

  // UI State
  isLoading: boolean;
  isFetchingGameInfo: boolean;
  validationErrors: ValidationErrors;
  error: string | null;

  // Actions
  setContractAddress: (address: string) => void;
  setGameInfo: (info: TimeoutGame | null) => void;
  setClaimedTimeout: (claimed: ClaimedTimeout | null) => void;
  setTimeRemaining: (time: number) => void;
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
  gameInfo: null,
  claimedTimeout: null,
  timeRemaining: 0,
  isLoading: false,
  isFetchingGameInfo: false,
  validationErrors: {},
  error: null,
};

export const useWithdrawStore = create<WithdrawStore>((set) => ({
  ...initialState,

  setContractAddress: (address) =>
    set({
      contractAddress: address,
      error: null,
      validationErrors: {},
    }),

  setGameInfo: (info) => set({ gameInfo: info }),

  setClaimedTimeout: (claimed) => set({ claimedTimeout: claimed }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setIsFetchingGameInfo: (fetching) => set({ isFetchingGameInfo: fetching }),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  setError: (error) => set({ error }),

  resetForm: () => set(initialState),

  reset: () => set(initialState),
}));
