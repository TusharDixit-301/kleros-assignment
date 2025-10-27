export interface RevealResult {
  contractAddress: string;
  yourMove: number;
  opponentMove: number;
  result: "win" | "loss" | "draw";
  stake: string;
}

export interface ContractGameData {
  j1: string;
  j2: string;
  c2: number;
  stake: bigint;
}

export interface StoredGameData {
  contractAddress: string;
  move: number;
  salt: string;
  hasherAddress: string;
  commitment: string;
}
