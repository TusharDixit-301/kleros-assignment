export interface GameInfo {
  contractAddress: string;
  player1: string;
  player2: string;
  stake: string;
  status: "waiting" | "joined" | "completed" | "error";
  lastAction: bigint;
}

export interface JoinedGame {
  contractAddress: string;
  move: number;
  transactionHash: string;
}

export interface ContractData {
  j1?: string;
  j2?: string;
  stake?: bigint;
  c2?: number;
  lastAction?: bigint;
}
