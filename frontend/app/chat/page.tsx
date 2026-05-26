"use client";

import React, { useState } from "react";
// 💡 インポートのパスを実際のフォルダ構成（../../）に完全に合わせた
import { useChat } from "../../hooks/useChat"; 

export default function ChatPage() {
  const [inputText, setInputText] = useState("");
  const { messages, isLoading, error, sendMessage } = useChat();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const textToSend = inputText;
    setInputText(""); // 入力欄をクリア
    await sendMessage(textToSend);
  };

  return (
    <div className="flex flex-col h-screen bg-[#d0e9ff] text-gray-800 font-sans relative overflow-hidden">
      {/* 背景の装飾用グラフィック（既存の雲などがある場合はそのまま活きる背景色にしています） */}
      
      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        
        {/* 上部のお天気・ステータス表示エリア */}
        <div className="flex gap-4 mb-6">
          {/* お天気カード */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg w-44 flex flex-col items-center text-center border border-white/40">
            <span className="text-xs font-bold text-gray-400 block mb-1">現在の気候</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl font-extrabold text-gray-700 tracking-tighter">
                {/* バックエンドのデバッグに合わせて、動的に変えても面白い場所です */}
                18°
              </span>
              <span className="text-2xl">☁️</span>
            </div>
            <div className="flex gap-2 text-xs font-bold mt-2">
              <span className="text-blue-500">12°</span>
              <span className="text-gray-300">/</span>
              <span className="text-red-400">22°</span>
            </div>
          </div>

          {/* アニメーション・ステータスカード */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg w-32 h-32 flex items-center justify-center border border-white/40">
            {isLoading ? (
              <div className="flex flex-col items-center gap-1">
                {/* 走るキャラの代わりに可愛いローディング演出 */}
                <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold text-pink-500 mt-2 animate-pulse">計算中...</span>
              </div>
            ) : (
              <div className="text-3xl animate-bounce">🏃💨</div>
            )}
          </div>
        </div>

        {/* チャットウィンドウ本体 */}
        <div className="w-full max-w-md bg-white/60 backdrop-blur-md rounded-[32px] shadow-xl border border-white/50 p-4 flex flex-col h-[450px]">
          
          {/* メッセージ表示エリア */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2 pr-1 scrollbar-none">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-6">
                <p className="text-xs font-medium text-gray-400 leading-relaxed">
                  ここにメッセージを入力すると、<br />
                  あなたの現在地とリアルタイムな天気を自動検知して<br />
                  最適なコーディネートをご提案します。
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-end`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-indigo-500 text-white rounded-br-none" // ユーザー（右側・インディゴ）
                          : "bg-pink-100 text-pink-700 rounded-bl-none" // AI（左側・可愛いピンクバルーン）
                      }`}
                    >
                      {/* 💡 超重要：useChat.ts から渡ってくる「text」を確実にバインド */}
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="mb-2 p-2 bg-red-50 text-red-500 rounded-xl text-[10px] text-center font-bold">
              {error}
            </div>
          )}

          {/* フッター：入力フォーム */}
          <form onSubmit={handleSend} className="relative mt-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              placeholder="メッセージを入力..."
              className="w-full bg-white/90 rounded-full pl-5 pr-14 py-3.5 text-xs font-medium shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder-gray-300 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-yellow-100 border border-yellow-200 shadow-sm flex items-center justify-center hover:bg-yellow-200 active:scale-95 transition-all disabled:bg-gray-100 disabled:border-gray-200 disabled:scale-100"
            >
              <span className="text-sm">✈️</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}