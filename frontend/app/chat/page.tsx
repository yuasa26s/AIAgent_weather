"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // 💡 画面遷移用のNext.js標準コンポーネント
import ChatComponent from "@/components/ChatComponent";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // 💡 お天気データの状態管理
  const [city, setCity] = useState("位置情報を確認中...");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherIcon, setWeatherIcon] = useState("☀️");

  // 天気コードに応じて絵文字を動的に切り替える
  const getWeatherEmoji = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) return "⛈️";
    if (weatherId >= 300 && weatherId < 600) return "☔";
    if (weatherId >= 600 && weatherId < 700) return "❄️";
    if (weatherId === 800) return "☀️";
    if (weatherId > 800) return "☁️";
    return "🌤️";
  };

  useEffect(() => {
    async function fetchFreshWeather() {
      const apiKey = "0605f3e8a39091b80ac45abc2afaf975";

      if (!navigator.geolocation) {
        console.warn("このブラウザは位置情報に対応していません。");
        applyFallbackWeather();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            setLoadingWeather(true);
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ja&appid=${apiKey}`
            );

            if (!response.ok) throw new Error("天気サーバーの応答エラー");
            const data = await response.json();

            setWeatherData(data);
            setCity(data.name || "現在地周辺");
            
            if (data.weather && data.weather[0]) {
              setWeatherIcon(getWeatherEmoji(data.weather[0].id));
            }

          } catch (e) {
            console.error("リアルタイム天気取得失敗:", e);
            applyFallbackWeather();
          } finally {
            setLoadingWeather(false);
          }
        },
        (error) => {
          console.warn("位置情報の利用が許可されませんでした。デフォルト値を適用します。");
          applyFallbackWeather();
        }
      );
    }

    function applyFallbackWeather() {
      const fallbackWeather = {
        main: { temp: 22, temp_max: 24, temp_min: 16 },
        weather: [{ description: "穏やかな気候", id: 800 }]
      };
      setWeatherData(fallbackWeather);
      setCity("横浜周辺");
      setWeatherIcon("🌤️");
      setLoadingWeather(false);
    }

    fetchFreshWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 flex flex-col items-center justify-start font-sans">
      
      {/* 🧭 🆕 ダッシュボード・ヘッダーエリア */}
      <header className="w-full bg-white/70 backdrop-blur-md border-b border-white/40 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          {/* 🚪 ホームに戻るボタン */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-100/80 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            戻る
          </Link>
          
          {/* ミニタイトル（アプリ名など） */}
          <span className="text-sm font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent ml-2 select-none">
            コーデ日和 Dashboard
          </span>
        </div>

        {/* 📑 今後メニューを増やせるナビゲーション用スペース（ダッシュボード機能） */}
        <nav className="flex items-center gap-4 text-xs font-bold text-slate-400">
          <span className="text-indigo-600 border-b-2 border-indigo-600 pb-0.5 px-1 cursor-default">AI Chat</span>
          {/* 今後機能を追加したくなったら、以下のように増やせます */}
          {/* <Link href="/history" className="hover:text-slate-600 transition-colors">過去のログ</Link> */}
          {/* <Link href="/settings" className="hover:text-slate-600 transition-colors">クローゼット設定</Link> */}
        </nav>
      </header>

      {/* 📱 メインコンテンツエリア */}
      <main className="w-full flex flex-col items-center p-6 max-w-2xl">
        
        {/* 1. お天気・アクティビティ カードエリア */}
        <div className="flex gap-4 mb-6 mt-2 animate-fade-in w-full justify-center">
          {/* 気温表示カード */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 flex flex-col items-center w-42">
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-1">
              {loadingWeather ? "Scanning..." : city}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                {weatherData ? `${Math.round(weatherData.main.temp)}°` : "ーー°"}
              </span>
              <span className="text-2xl select-none">{weatherIcon}</span>
            </div>
            <div className="flex gap-2 mt-2 text-xs font-semibold">
              <span className="text-blue-500">{weatherData ? `${Math.round(weatherData.main.temp_min)}°` : "ーー°"}</span>
              <span className="text-slate-300">/</span>
              <span className="text-red-500">{weatherData ? `${Math.round(weatherData.main.temp_max)}°` : "ーー°"}</span>
            </div>
            {weatherData?.weather?.[0]?.description && (
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                {weatherData.weather[0].description}
              </span>
            )}
          </div>

          {/* アクティビティカード */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 flex items-center justify-center w-28 transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl select-none drop-shadow-sm animate-pulse">👟✨</span>
              <span className="text-[10px] text-slate-500 font-extrabold tracking-wider mt-1">NIGHT RUN</span>
            </div>
          </div>
        </div>

        {/* 2. チャットコンポーネント */}
        <div className="w-full">
          <ChatComponent 
            currentCity={city} 
            currentWeatherData={weatherData} 
          />
        </div>

      </main>

    </div>
  );
}