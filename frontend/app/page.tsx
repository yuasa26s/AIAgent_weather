"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  // 🌤️ 天気連動用のステート（開発・確認用にここで切り替えられます）
  // 本番時はAPI等から取得した「"Clear" / "Rain" / "Clouds" / "Snow"」等を代入してください
  const [currentWeather, setCurrentWeather] = useState<"Clear" | "Rain" | "Clouds" | "Snow">("Clear");

  // 天気に合わせた背景グラデーションとテーマ色のマッピング
  const themeStyles = {
    Clear: {
      bg: "from-amber-50 via-orange-50 to-sky-100",
      orb1: "bg-amber-300/20",
      orb2: "bg-orange-300/20",
      buttonBg: "bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300",
      buttonText: "text-amber-900",
      emoji: "☀️",
      accentText: "from-amber-600 via-orange-600 to-amber-500"
    },
    Rain: {
      bg: "from-slate-700 via-slate-800 to-zinc-900",
      orb1: "bg-blue-500/10",
      orb2: "bg-indigo-500/10",
      buttonBg: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
      buttonText: "text-white",
      emoji: "☔",
      accentText: "from-blue-400 via-indigo-400 to-sky-300"
    },
    Clouds: {
      bg: "from-slate-100 via-blue-50 to-zinc-200",
      orb1: "bg-slate-300/30",
      orb2: "bg-blue-200/20",
      buttonBg: "bg-gradient-to-r from-slate-300 to-blue-200 hover:from-slate-400 hover:to-blue-300",
      buttonText: "text-slate-800",
      emoji: "☁️",
      accentText: "from-slate-600 via-blue-600 to-slate-500"
    },
    Snow: {
      bg: "from-blue-50 via-indigo-50 to-slate-100",
      orb1: "bg-sky-200/30",
      orb2: "bg-indigo-200/20",
      buttonBg: "bg-gradient-to-r from-sky-100 to-indigo-100 hover:from-sky-200 hover:to-indigo-200",
      buttonText: "text-indigo-900",
      emoji: "❄️",
      accentText: "from-sky-500 via-indigo-500 to-purple-400"
    }
  };

  const currentTheme = themeStyles[currentWeather] || themeStyles.Clear;

  return (
    <main className={`relative flex min-h-screen flex-col items-center justify-between p-6 md:p-12 bg-gradient-to-b ${currentTheme.bg} transition-colors duration-1000 ease-in-out overflow-hidden`}>
      
      {/* 🔮 お天気連動 背景の有機的なオーブ */}
      <div className={`absolute top-1/4 left-1/10 w-[35rem] h-[35rem] rounded-full blur-3xl ${currentTheme.orb1} animate-pulse duration-[6000ms]`} />
      <div className={`absolute bottom-1/4 right-1/10 w-[35rem] h-[35rem] rounded-full blur-3xl ${currentTheme.orb2} animate-pulse duration-[8000ms]`} />

      {/* 🛠️ デバッグ・確認用お天気切り替えタブ（開発時のみ使用、不要なら削除してOKです！） */}
      <div className="relative z-50 flex gap-1 p-1 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-sm text-xs mt-2">
        {(["Clear", "Clouds", "Rain", "Snow"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setCurrentWeather(w)}
            className={`px-3 py-1.5 rounded-full transition-all font-medium ${
              currentWeather === w ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {w === "Clear" ? "☀️ 晴" : w === "Clouds" ? "☁️ 曇" : w === "Rain" ? "☔ 雨" : "❄️ 雪"}
          </button>
        ))}
      </div>

      {/* 📦 メインコンテンツ・コンテナ（中央配置のレイアウトベース） */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto my-auto space-y-10 text-center">
        
        {/* 1. タイトルエリア（最上部） */}
        <div className="space-y-2">
          <h1 className={`text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r ${currentTheme.accentText} bg-clip-text text-transparent drop-shadow-sm transition-all duration-1000`}>
            コーデ日和
          </h1>
          <p className={`text-sm md:text-base font-semibold tracking-widest ${currentWeather === "Rain" ? "text-slate-400" : "text-slate-500"}`}>
            今日の天気に心地いい服装を
          </p>
        </div>

        {/* 2. 【ご要望】画面のド真ん中に配置された「タップ」ボタン */}
        <div className="w-full flex justify-center py-4">
          <Link 
            href="/chat" 
            className={`group relative inline-flex items-center justify-center px-20 py-4.5 text-xl font-bold tracking-widest ${currentTheme.buttonBg} ${currentTheme.buttonText} backdrop-blur-sm rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transform hover:-translate-y-1 transition-all duration-300 ease-out active:translate-y-0 active:scale-95 cursor-pointer border border-white/20`}
          >
            <span className="relative flex items-center gap-3">
              タップして始める
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>

        {/* 3. 【ご要望】ボタンの下に滑り込ませたイラスト＆アニメーションエリア */}
        <div className="w-full max-w-[240px] aspect-square relative flex items-center justify-center">
          {/* 切れていた画像リンクの代わりに、お天気連動でダイナミックに浮遊する美しいガラス調グラフィック */}
          <div className="w-full h-full bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl flex flex-col items-center justify-center p-6 transform hover:rotate-2 transition-transform duration-500">
            {/* 動くメインお天気巨大エフェクト */}
            <div className="text-7xl mb-4 animate-bounce duration-[3000ms] select-none">
              {currentTheme.emoji}
            </div>
            
            {/* 可愛いランニングドット風ミニグラフィック */}
            <div className="relative w-full flex justify-center items-center overflow-hidden h-12">
              <span className="text-3xl animate-pulse">🏃‍♀️</span>
              <span className="absolute right-4 text-xs tracking-tighter opacity-20 animate-ping">•••</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. 最下部に固定された綺麗なクリーンフッター */}
      <div className={`relative z-10 text-[10px] font-medium tracking-widest ${currentWeather === "Rain" ? "text-slate-500" : "text-slate-400"} pb-2`}>
        © 2026 コーデ日和 — WEATHER OUTFIT EXPERT
      </div>
    </main>
  );
}