import { create } from "zustand";
import { RevealResult, ContractGameData } from "../../domain/types/claim.types";

interface ValidationErrors {
  contractAddress?: string;
  yourMove?: string;
}

interface ClaimStore {
  // Form State
  contractAddress: string;
  yourMove: number | null;
  contractGameData: ContractGameData | null;
  revealResult: RevealResult | null;

  // UI State
  isLoading: boolean;
  isFetchingGameData: boolean;
  validationErrors: ValidationErrors;
  error: string | null;

  // Actions
  setContractAddress: (address: string) => void;
  setYourMove: (move: number | null) => void;
  setContractGameData: (data: ContractGameData | null) => void;
  setRevealResult: (result: RevealResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsFetchingGameData: (fetching: boolean) => void;
  setValidationErrors: (errors: ValidationErrors) => void;
  setError: (error: string | null) => void;

  // Complex Actions
  resetForm: () => void;
  reset: () => void;
}

const initialState = {
  contractAddress: "",
  yourMove: null,
  contractGameData: null,
  revealResult: null,
  isLoading: false,
  isFetchingGameData: false,
  validationErrors: {},
  error: null,
};

export const useClaimStore = create<ClaimStore>((set) => ({
  ...initialState,

  setContractAddress: (address) =>
    set({
      contractAddress: address,
      error: null,
      validationErrors: {},
      revealResult: null,
    }),

  setYourMove: (move) => set({ yourMove: move }),

  setContractGameData: (data) => set({ contractGameData: data }),

  setRevealResult: (result) => set({ revealResult: result }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setIsFetchingGameData: (fetching) => set({ isFetchingGameData: fetching }),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  setError: (error) => set({ error }),

  resetForm: () => set(initialState),

  reset: () => set(initialState),
}));
