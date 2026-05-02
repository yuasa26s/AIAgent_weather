"use client";

//import { useChat } from "@/hooks/useChat";
// import WeatherCard from "../weather/WeatherCard";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import CloudBackground from "../ui/CloudBackground";
import { ChatMessage } from "@/types";
import OutfitCard from "../weather/OutfitCard";
import WeatherContainer from "@/components/weather/WeatherContainer";

type Props = {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  loading?: boolean;
  error?: string | null;
};

export default function ChatUI({
  messages,
  onSendMessage,
  loading,
  error,
}: Props) {
  return (
    <main className="h-screen w-full bg-gradient-to-b from-[#BAE6FD] to-[#E0F2FE] flex flex-col relative overflow-hidden">
      <CloudBackground />

      {/* 天気エリア */}
      <div className="h-1/2 w-full flex flex-col items-center justify-center z-10 p-8">
        <div className="w-full max-w-md flex justify-between items-center">
          <div className="scale-125 origin-left">
            <WeatherContainer />
          </div>

          {/* コーデエリア */}
          <div className="flex flex-col items-center gap-2">
            {/* アイコンの上のつぶやき */}
            <p className="text-slate-500 text-sm font-bold animate-pulse">
              {!error && loading && "GPSを捜索中..."}
              {error && "迷子中..."}
            </p>
            {messages.some((m) => m.role === "assistant") ? (
              // 【成功！】コーデ提案だけを表示
              <div className="animate-in zoom-in duration-500">
                <OutfitCard />
              </div>
            ) : (
              // 【待機中 または 失敗】丸いエリアを表示
              <div className="w-48 h-48 flex items-center justify-center bg-white/30 rounded-full border-4 border-white/20 shadow-xl backdrop-blur-md transition-all">
                <span
                  className={`text-[100px] ${error ? "grayscale opacity-50" : ""}`}
                >
                  {error ? "😵‍💫" : "🏃‍♀️"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* チャットコンテナ */}
      <div className="h-1/2 w-full flex justify-center z-10 px-6 pb-10">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-xl rounded-[40px] p-6 shadow-2xl flex flex-col border border-white/30 overflow-hidden">
          {error && (
            <p className="text-red-500 text-xs mb-2 font-bold animate-bounce">
              ⚠️ 通信失敗 ⚠️ もう一度送ってみてね！
            </p>
          )}

          <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                text={msg.content}
                isAi={msg.role === "assistant"}
              />
            ))}
          </div>

          <ChatInput onSendMessage={onSendMessage} disabled={loading} />
        </div>
      </div>
    </main>
  );
}
