import { GameData } from "../../domain/types/game.types";

export class StorageService {
  private static STORAGE_PREFIX = "game_";

  static storeGameData(
    contractAddress: string,
    move: number,
    salt: bigint,
    commitment: string
  ): void {
    const gameData: GameData = {
      move,
      salt: salt.toString(),
      commitment,
      timestamp: Date.now(),
    };

    const key = `${this.STORAGE_PREFIX}${contractAddress}`;
    localStorage.setItem(key, JSON.stringify(gameData));

    console.log("Stored game data for address:", contractAddress, gameData);
  }

  static getGameData(contractAddress: string): GameData | null {
    const key = `${this.STORAGE_PREFIX}${contractAddress}`;
    const data = localStorage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as GameData;
    } catch (error) {
      console.error("Failed to parse game data:", error);
      return null;
    }
  }

  static removeGameData(contractAddress: string): void {
    const key = `${this.STORAGE_PREFIX}${contractAddress}`;
    localStorage.removeItem(key);
  }

  static getAllGameAddresses(): string[] {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX)) {
        keys.push(key.replace(this.STORAGE_PREFIX, ""));
      }
    }

    return keys;
  }
}
