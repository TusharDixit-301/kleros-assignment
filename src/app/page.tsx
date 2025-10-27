"use client";

import Header from "@/shared/components/Header";
import { TabSelector } from "@/shared/components/TabSelector";
import { TabContent } from "@/shared/components/TabContent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col px-3 py-3">
      <Header />

      <div className="mt-3 grid w-full flex-1 grid-cols-1 gap-3 lg:grid-cols-[280px_1fr]">
        <TabSelector />
        <TabContent />
      </div>
    </main>
  );
}
