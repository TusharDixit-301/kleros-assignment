"use client";

import { Button } from "@/shared/components/core/button";
import { useState } from "react";

export function WithdrawFunds() {
  const [amount, setAmount] = useState<string>("");

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-medium text-white">Withdraw Funds</h2>
        <p className="text-white/70">
          Withdraw your available balance from the contract.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-white/20 p-6">
        <p className="text-sm text-white/50">Available Balance</p>
        <p className="text-2xl font-bold text-white">0.00 ETH</p>
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Amount to withdraw"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-2xl border border-white/40 bg-transparent px-6 py-3 text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none"
        />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full rounded-2xl border-white/40 text-white hover:bg-white/10"
      >
        Withdraw
      </Button>
    </div>
  );
}
