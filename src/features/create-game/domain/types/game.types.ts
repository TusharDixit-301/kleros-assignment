export interface GameData {
  move: number;
  salt: string;
  commitment: string;
  timestamp: number;
}

export interface CreatedGame {
  contractAddress: string;
  commitment: string;
  transactionHash: string;
}

export type DeploymentStep =
  | "idle"
  | "deploying-hasher"
  | "waiting-hasher"
  | "generating-commitment"
  | "deploying-rps"
  | "waiting-rps"
  | "storing-data"
  | "completed";

export interface DeploymentProgress {
  step: DeploymentStep;
  message: string;
  txHash?: string;
}
