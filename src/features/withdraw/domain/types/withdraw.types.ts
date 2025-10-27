export interface TimeoutGame {
  contractAddress: string;
  player1: string;
  player2: string;
  stake: string;
  lastAction: bigint;
  gameState: "created" | "joined" | "revealed";
  timeoutDuration: number;
  timeRemaining: number;
  canPlayerClaim: boolean;
}

export interface ClaimedTimeout {
  contractAddress: string;
  amount: string;
}

export interface ContractTimeoutData {
  j1: string;
  j2: string;
  stake: bigint;
  c2: number;
  lastAction: bigint;
  timeout: bigint;
}
