// UUID取得
"use client";

import { useChat } from "@/hooks/useChat";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatUI from "@/components/chat/ChatUI";
import WeatherContainer from "@/components/weather/WeatherContainer";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? ""; // nullを防ぐ

  const { messages, sendMessage, loading, error } = useChat(userId);

  //const [input, setInput] = useState("");

  if (!userId) {
    return <div>Invalid access. No userId found.</div>;
  }

  //   const handleSend = async () => {
  //     if (!input.trim()) return;
  //     await sendMessage(input);
  //     setInput("");
  //   };

  return (
  <div className="flex flex-col gap-6">
    <ChatUI
      messages={messages} // エンジンからもらったメッセージを渡す
      onSendMessage={sendMessage} // エンジンの送信機能を渡す
      loading={loading} // 通信中かどうかを渡す
      error={error}
    />
  </div>
  );
}
