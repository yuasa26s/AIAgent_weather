// components/chat/ChatInput.tsx
"use client";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return; // 空っぽなら送らない
    onSendMessage(inputText); // 親（page.tsx）に文字を渡す
    setInputText(""); // 入力欄を空にする
  };

  return (
    <div className="w-full flex gap-2 items-center bg-white/50 p-2 rounded-full border border-white/30 shadow-inner">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)} // 文字を打つたびに記憶
        placeholder="メッセージを入力..."
        className="flex-1 bg-transparent px-4 py-2 outline-none text-charcoal-gray font-bold"
      />
      <button
        onClick={handleSend}
        className="bg-sunny-yellow p-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="text-xl">✈️</span>
      </button>
    </div>
  );
}
