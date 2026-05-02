// 1. どんなデータを受け取るか定義
type WeatherProps = {
  location?: string;
  temp?: number;
  condition?: string; // "☀️" や "☁️" など
  lowTemp?: number;
  highTemp?: number;
};

export default function WeatherCard({
  location = "取得中...",
  temp = 0,
  condition = "❓",
  lowTemp = 0,
  highTemp = 0,
}: WeatherProps) {
  return (
    <div className="bg-white/30 backdrop-blur-md p-7 rounded-[20px] shadow-lg border border-white/20 min-w-[160px] ">
      <p className="text-charcoal-gray text-sm font-bold opacity-90">
        {location}の天気
      </p>
      <div className="flex items-center gap-2">
        <h2 className="text-4xl font-black text-charcoal-gray">{temp}°</h2>
        <span className="text-4xl">{condition}</span>
      </div>
      <div className="flex gap-2 text-x font-bold mt-1">
        <span className="text-blue-600">{lowTemp}°</span>
        <span className="text-charcoal-gray">/</span>
        <span className="text-red-600">{highTemp}°</span>
      </div>
    </div>
  );
}
