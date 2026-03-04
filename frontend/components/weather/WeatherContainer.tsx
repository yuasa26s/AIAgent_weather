//ロジック担当
//GPSを取得して位置情報を表示するコンポーネント
//都道府県取得
//天気API取得
//state管理
//WeatherCardに渡す
"use client"

import { useEffect, useState } from "react";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import WeatherCard from "@/components/weather/WeatherCard";

export default function WeatherContainer() {
  const { latitude, longitude, loading, error } = useGeoLocation();
  const [cityName, setCityName] = useState<string>("取得中...");
  const [temp, setTemp] = useState<number>(0);

useEffect(() => {
    //座標（latitude, longitude）が取得できたらMockデータをセット
    if (latitude && longitude) {
        // 本来はここでバックエンドを叩くが、今は仮の値をセット
        // 1秒後にデータが返ってきたという「フリ」をする
      const timer = setTimeout(() => {
        setCityName("東京都"); // ここを好きな地名に変えてテスト可能
        setTemp(18);          // 仮の気温
      }, 1000);

      return () => clearTimeout(timer); // クリーンアップ
  }
}, [latitude, longitude]);


//エラー時やロード時の表示
if (error) return <div className="p-4 text-red-500">位置情報エラー: {error}</div>;
  if (loading && !latitude) return <div className="p-4 text-gray-500">GPS信号を探しています...</div>;

  return (
    <WeatherCard
      location={cityName} // stateを渡す
      temp={temp}         // stateを渡す
      condition="☀️"      // ここも将来的にAPIから取得
      lowTemp={12}
      highTemp={22}
    />
  );
}