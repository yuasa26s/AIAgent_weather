// frontend/app/page.tsx
"use client";

import Link from "next/link";
import CloudBackground from "../components/ui/CloudBackground";

export default function Home() {
  return (
    // 雲がはみ出さないように overflow-hidden を追加
    <main className="min-h-screen bg-gradient-to-b from-[#BAE6FD] to-[#E0F2FE] flex flex-col items-center justify-between pt-32 pb-20 px-6 text-white relative overflow-hidden">
      <CloudBackground />

      {/* --- コンテンツレイヤー (z-10で雲の前に出す) --- */}
      {/*タイトル */}
      <div className="flex flex-col items-center gap-4 z-10">
        <h1 className="text-7xl font-sans font-bold tracking-tight drop-shadow-md">
          コーデ日和
        </h1>
        <p className="text-lg font-medium opacity-90">今日の服装をご提案</p>
      </div>

      {/*ボタン */}
      <div className="w-full flex justify-center z-10">
        <Link href="/chat">
          <button className="bg-sunny-yellow text-charcoal-gray text-xl px-12 py-4 rounded-full font-bold shadow-xl active:scale-90 transition-all hover:scale-105">
            タップ
          </button>
        </Link>
      </div>
    </main>
  );
}
