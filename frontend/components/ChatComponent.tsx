"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

interface ChatComponentProps {
  currentCity: string;
  currentWeatherData: any; 
}

export default function ChatComponent({ currentCity, currentWeatherData }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `こんにちは！現在の${currentCity || "横浜"}の気候に合わせたコーディネートをご提案します。何か気になるお出かけや予定はありますか？`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Markdownパースを壊す余分な記号をきれいに掃除する関数
  const cleanMessageText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/#+/g, "")
      .replace(/\*\*/g, "")
      .replace(/^\s*-\s*/gm, "・ ")
      .trim();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // 💡 404回避のための最大ポイント:
    // もし /api/v1/chat で404になる場合は、FastAPI側のルート定義に合わせて最悪のケースもフォールバックします。
    const urlsToTry = [
      "http://127.0.0.1:8000/api/v1/chat",
      "http://127.0.0.1:8000/chat"
    ];

    let response = null;
    let lastError = null;

    // 確実に開通しているURLを自動で探ります
    for (const url of urlsToTry) {
      try {
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userText,
            city: currentCity || "横浜",
            // 💡 親から届いた「日中27℃」のリアルデータをそのままバックエンドへ送信
            weather_data: currentWeatherData, 
          }),
        });
        if (response.ok) break; 
      } catch (err) {
        lastError = err;
      }
    }

    try {
      if (!response || !response.ok) {
        throw new Error(`サーバーに接続できません。FastAPIの起動を確認してください。ステータス: ${response?.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("通信エラー詳細:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: "申し訳ありません。サーバーとの通信に失敗しました。バックエンドのターミナルでUvicornがエラーなく動いているか確認してください。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/40 flex flex-col h-[500px]">
      <div className="flex-1 p-6 overflow-y-auto space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-gradient-to-b from-blue-50/10 to-pink-50/10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm ${
              msg.sender === "user"
                ? "bg-indigo-600 text-white rounded-tr-none font-medium whitespace-pre-wrap"
                : "bg-white/90 text-slate-800 rounded-tl-none border border-slate-100"
            }`}>
              {msg.sender === "ai" ? (
                <div className="space-y-2 text-slate-700 font-normal">
                  <ReactMarkdown components={{ p: ({ ...props }) => <p className="leading-relaxed m-0 block whitespace-pre-wrap" {...props} /> }}>
                    {cleanMessageText(msg.text)}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 border border-slate-100 text-slate-400 text-xs rounded-2xl px-4 py-2.5 animate-pulse shadow-sm">
              スタイリストが本日の気温に合わせた着こなしを計算中...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white/60 border-t border-slate-100/80 flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 bg-white border border-slate-200/80 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-inner"
          disabled={isLoading}
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition-all shadow-md disabled:opacity-40 flex items-center justify-center w-11 h-11 shrink-0" disabled={isLoading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-45 -translate-x-0.5 translate-y-0.5">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}