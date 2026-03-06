// 状態管理
// hooks/useChat.ts
// UI
//  └─ useChat()
//       ├─ useGeoLocation
//       ├─ sessionId生成
//       └─ API呼び出し
//チャット機能を丸ごと持つ
// sessionIdを内部で管理 => UUIDハログイン時に生成され、URLで渡る
// 位置情報も内部で取得。useChatが内部でuseGeoLocationを呼ぶ
// UIはuseChat() だけ呼べば動く

"use client";
import { useState } from "react";
import { ChatMessage } from "@/types";
import { postOutfitRecommendation } from "@/lib/chat-api";
import { useGeoLocation } from "@/hooks/useGeoLocation";

export const useChat = (sessionId: string) => {
  const { latitude, longitude } = useGeoLocation(); // 位置情報も内部で取得

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!latitude || !longitude) {
      setError("Location not available");
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const res = await postOutfitRecommendation({
        sessionId,
        latitude,
        longitude,
        message: content,
      });

      setMessages((prev) => [...prev, res.outfit_recommendation]);
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
};

// UI側での使い方
// const { messages, sendMessage, loading } = useChat()
