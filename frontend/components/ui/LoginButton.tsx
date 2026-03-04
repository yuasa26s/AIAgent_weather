// UUIDを使ってチャット画面へ飛ばす

"use client";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  const handleStart = () => {
    // 1. UUIDを生成する（これがユーザーID）
    const newId = uuidv4();
    console.log("Generated UUID:", newId);

    // 2. 画面遷移
    // URLパラメータとしてIDを渡す
    router.push(`/chat?userId=${newId}`);
  };

  return (
    <button
      onClick={handleStart}
      className="bg-sunny-yellow text-charcoal-gray text-xl px-12 py-4 rounded-full font-bold shadow-xl active:scale-90 transition-all hover:scale-105"
    >
      タップ
    </button>
  );
}
