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
    <main className="min-h-screen bg-milky-blue p-4 flex flex-col items-center">
      <CloudBackground />

      {/* 天気エリア */}
      <div className="w-full max-w-md flex justify-between items-center mt-6 mb-6 px-2">
        <WeatherCard />
        <div className="w-32 h-32 flex items-center justify-center bg-white/30 rounded-full border-4 border-white/20">
          <span className="text-[70px]">🏃‍♀️</span>
        </div>
      </div>

      {/* チャットコンテナ */}
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-[40px] p-6 flex-1 shadow-xl flex flex-col border border-white/20">
        <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-2">
          {/* 記憶しているメッセージを順番に表示する */}
          {messages.map((msg, index) => (
            <MessageBubble key={index} text={msg.text} isAi={msg.isAi} />
          ))}
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  );
}
