"use client";

export function GameRules() {
  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-2xl font-black uppercase text-yellow-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)]">
          📜 Game Rules
        </h2>
      </div>

      <div className="w-full space-y-3">
        <section className="comic-border rounded-xl bg-pink-400 p-4">
          <h3 className="mb-3 text-lg font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">
            🎮 Rock Paper Scissors Lizard Spock
          </h3>
          <ul className="space-y-1 text-sm font-bold text-black">
            <li>✂️ Scissors cuts Paper</li>
            <li>📄 Paper covers Rock</li>
            <li>🪨 Rock crushes Lizard</li>
            <li>🦎 Lizard poisons Spock</li>
            <li>🖖 Spock smashes Scissors</li>
            <li>✂️ Scissors decapitates Lizard</li>
            <li>🦎 Lizard eats Paper</li>
            <li>📄 Paper disproves Spock</li>
            <li>🖖 Spock vaporizes Rock</li>
            <li>🪨 Rock crushes Scissors</li>
          </ul>
        </section>

        <section className="comic-border rounded-xl bg-cyan-400 p-4">
          <h3 className="mb-3 text-lg font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">
            🕹️ How to Play
          </h3>
          <ol className="list-inside list-decimal space-y-1 text-sm font-bold text-black">
            <li>Create a game by selecting your move and stake amount</li>
            <li>Share the game ID with your opponent</li>
            <li>Opponent joins and makes their move</li>
            <li>Game resolves automatically based on the rules above</li>
            <li>Winner claims the prize</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
