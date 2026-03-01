// app/chat/page.tsx
"use client";

import WeatherCard from "../../components/weather/WeatherCard";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-milky-blue p-4 flex flex-col items-center">
      {/* 天気エリア */}
      <div className="w-full max-w-md flex justify-between items-center mt-6 mb-6 px-2">
        <WeatherCard />
        <div className="w-32 h-32 flex items-center justify-center bg-white/30 rounded-full border-4 border-white/20">
          <span className="text-[70px]">🏃‍♀️</span>
        </div>
      </div>

      {/* チャットコンテナ */}
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-[40px] p-6 flex-1 shadow-xl flex flex-col border border-white/20">
        {/* メッセージ表示エリア */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          <MessageBubble text="今日はランニングしに行くんだけど上着は必要かな？" />
          <MessageBubble
            isAi
            text="ランニングいいですね!今日は最高気温15度です。走ると暑くなりますが、休憩中は冷えるので薄手のウィンドブレーカーがあると安心ですよ!"
          />
        </div>

        {/* 入力エリア */}
        <ChatInput />
      </div>
    </main>
  );
}
