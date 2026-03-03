"use client";
import { useState } from "react";
import WeatherCard from "../../components/weather/WeatherCard";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";
import CloudBackground from "../../components/ui/CloudBackground";

export default function ChatPage() {
  // メッセージのリストを記憶する（最初は空っぽ [] ）
  const [messages, setMessages] = useState<{ text: string; isAi: boolean }[]>(
    [],
  );
  const handleSendMessage = (text: string) => {
    // 自分のメッセージを追加
    const newMessage = { text, isAi: false };
    setMessages((prev) => [...prev, newMessage]);

    // 1秒後にAIが適当に返事をする（フリをする）
    setTimeout(() => {
      const aiReply = { text: "素敵なコーデですね！", isAi: true };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  return (
    <main className="h-screen w-full bg-gradient-to-b from-[#BAE6FD] to-[#E0F2FE] flex flex-col relative overflow-hidden">
      <CloudBackground />

      {/* 天気エリア */}
      <div className="h-1/2 w-full flex flex-col items-center justify-center z-10 p-8">
        <div className="w-full max-w-md flex justify-between items-center">
          <div className="scale-125 origin-left">
            <WeatherCard />
          </div>

          {/* ここがキャラクター。将来的に状態(state)で画像を変えます */}
          <div className="w-48 h-48 flex items-center justify-center bg-white/30 rounded-full border-4 border-white/20 shadow-xl backdrop-blur-md transition-all">
            <span className="text-[100px] animate-bounce">🏃‍♀️</span>
          </div>
        </div>
      </div>

      {/* チャットコンテナ */}
      <div className="h-1/2 w-full flex justify-center z-10 px-6 pb-10">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-xl rounded-[40px] p-6 shadow-2xl flex flex-col border border-white/30 overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2 custom-scrollbar">
            {messages.map((msg, index) => (
              <MessageBubble key={index} text={msg.text} isAi={msg.isAi} />
            ))}
          </div>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </main>
  );
}
