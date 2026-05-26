import { useState } from "react";

// メッセージの型定義
export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ブラウザの位置情報API（Geolocation）を使用し、
   * 緯度・経度から「都道府県＋市区町村名」を逆引きして取得する内部関数
   */
  const getCurrentLocationCity = (): Promise<string> => {
    return new Promise((resolve) => {
      // ブラウザが位置情報に対応していない場合
      if (!navigator.geolocation) {
        console.warn("このブラウザは位置情報に対応していません。デフォルト値を使用します。");
        resolve("東京");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // 無料・会員登録不要の逆ジオコーディングAPI（OSM Nominatim）を利用
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ja`,
              { headers: { "User-Agent": "MyFashionRAGApp/1.0" } } // APIの利用ポリシー遵守のため
            );
            
            if (!response.ok) throw new Error("位置情報の逆引きに失敗しました");
            
            const data = await response.json();
            const address = data.address || {};
            
            // "神奈川県" などの都道府県名を取得
            const state = address.state || address.province || "";
            // "横浜市" や "藤沢市"、あるいは東京23区などの市区町村名を取得
            const city = address.city || address.town || address.village || address.suburb || "東京";
            
            // 「神奈川県横浜市」のような文字列を結合して返す
            resolve(`${state}${city}`);
          } catch (err) {
            console.error("地名逆引きエラー:", err);
            resolve("東京"); // エラー時のフォールバック
          }
        },
        (err) => {
          console.warn("位置情報の取得が拒否されたか、タイムアウトしました:", err.message);
          resolve("東京"); // ユーザーが位置情報を拒否した時のデフォルト
        },
        { enableHighAccuracy: true, timeout: 5000 } // 5秒でタイムアウト
      );
    });
  };

  /**
   * メッセージ送信処理（バックエンドの /api/v1/chat/chat を叩くフェッチ処理）
   */
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. ユーザーの入力を画面上のチャット履歴に即時追加
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // 2. 送信の直前にブラウザ側で現在地（都市名）を自動取得
      const detectedCity = await getCurrentLocationCity();
      console.log(`位置検知結果: ${detectedCity}`);

      // 3. バックエンドの FastAPI（/api/v1/chat/chat）へフェッチ通信
      const response = await fetch("http://127.0.0.1:8000/api/v1/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          city: detectedCity, // 👈 自動検知した「ご当地名」がここに入る
          weather: "自動取得中", // バックエンド側で上書きするため、初期値を渡しておく
        }),
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      const data = await response.json();

      // 4. バックエンドから返ってきたスマートな返答を画面に反映
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (err: any) {
      console.error("チャット送信エラー:", err);
      setError(err.message || "通信エラーが発生しました");
      
      // エラー時もチャットがフリーズしないよう、システムメッセージを追加
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "申し訳ありません。通信中にエラーが発生しました。バックエンドのログを確認してください。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};