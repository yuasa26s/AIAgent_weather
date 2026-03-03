"use client";

import WeatherCard from "../weather/WeatherCard";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import CloudBackground from "../ui/CloudBackground";

type Props = {
  messages: {
    id: string;
    content: string;
    isAi: boolean;
  }[];
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
    <main className="min-h-screen bg-milky-blue p-4 flex flex-col items-center">
      <CloudBackground />

      <div className="w-full max-w-md flex justify-between items-center mt-6 mb-6 px-2">
        <WeatherCard />
        <div className="w-32 h-32 flex items-center justify-center bg-white/30 rounded-full border-4 border-white/20">
          <span className="text-[70px]">🏃‍♀️</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-[40px] p-6 flex-1 shadow-xl flex flex-col border border-white/20">
        {error && <p>{error}</p>}

        <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-2">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} text={msg.content} isAi={msg.isAi} />
          ))}
        </div>

        <ChatInput onSendMessage={onSendMessage} disabled={loading} />
      </div>
    </main>
  );
}
