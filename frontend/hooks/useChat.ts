"use client";
import { useState } from "react";
import { ChatMessage } from "@/types";
import { useGeoLocation } from "@/hooks/useGeoLocation";

export const useChat = (sessionId: string) => {
  const { latitude, longitude } = useGeoLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    // 1. ユーザーのメッセージを画面に即時反映
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
      // 2. バックエンドAPIへのリクエスト（ホスト名を localhost に統一）
      const response = await fetch("http://localhost:8000/api/v1/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          city: "東京",    // 状況に応じて位置情報から逆算可能
          weather: "晴れ"  // 同上
        }),
      });

      // HTTPステータスが 200 OK 以外（500や404など）の場合のハンドリング
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend Error (Status: ${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // 3. AIからの正常な返答をメッセージリストに追加
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sessionId,
          role: "assistant",
          content: data.response, // バックエンドのレスポンス構造 { "response": "..." } に準拠
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      // Next.jsの開発用黒画面（オーバーレイ）を起動させないために、
      // console.error ではなく console.warn でブラウザのコンソール(F12)に逃がす
      console.warn("─── [Chat API Error Detail] ───");
      console.warn(err);
      console.warn("───────────────────────────────");

      // 画面上のUIにはこのエラーメッセージが綺麗に表示されます
      setError("AIアドバイザーとの通信に失敗しました。バックエンドのログを確認してください。");
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