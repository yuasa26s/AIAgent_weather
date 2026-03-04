// UUID取得,状態管理,API呼び出し,ロジック制御
//本番ロジック
"use client";

import { useSearchParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import ChatUI from "./ChatUI";

export default function ChatContainer() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";

  const { messages, sendMessage, loading, error } = useChat(userId);

  if (!userId) {
    return <div>Invalid access. No userId found.</div>;
  }

  return (
    <ChatUI
      messages={messages}
      onSendMessage={sendMessage}
      loading={loading}
      error={error}
    />
  );
}
