// ログインページ
"use client";

import Image from "next/image"; //
import CloudBackground from "../components/ui/CloudBackground";
import LoginButton from "../components/ui/LoginButton";
import Illustrations from "../components/ui/Illustrations";

export default function Home() {
  return (
    // 雲がはみ出さないように overflow-hidden を追加
    <main className="min-h-screen bg-gradient-to-b from-[#BAE6FD] to-[#E0F2FE] flex flex-col items-center pt-32 pb-20 px-6 text-white relative overflow-hidden">
      <CloudBackground />

      {/*タイトル */}
      <div className="flex flex-col items-center gap-6 z-10">
        <h1 className="text-7xl font-sans font-bold tracking-tight drop-shadow-md text-sunny-yellow">
          コーデ日和
        </h1>
        <p className="text-lg font-medium opacity-90">今日の服装をご提案</p>
      </div>

      {/* イラスト表示エリア */}
      <div className="z-10 mt-10">
        <Illustrations />
      </div>

      {/*ボタン */}
      <div className="w-full flex justify-center z-10 mt-auto">
        <LoginButton />
      </div>
    </main>
  );
}
