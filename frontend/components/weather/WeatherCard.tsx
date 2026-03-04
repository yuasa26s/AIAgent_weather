// components/Weather/WeatherCard.tsx
export default function WeatherCard() {
  return (
    <div className="bg-card-purple/80 backdrop-blur-md p-4 rounded-[30px] shadow-lg border border-white/20 min-w-[140px]">
      <p className="text-white text-sm font-bold opacity-90">東京の天気</p>
      <div className="flex items-center gap-2">
        <h2 className="text-4xl font-black text-white">15°</h2>
        <span className="text-3xl">☀️</span>
      </div>
      <div className="flex gap-2 text-xs font-bold mt-1">
        <span className="text-blue-100">4°</span>
        <span className="text-white/50">/</span>
        <span className="text-red-100">16°</span>
      </div>
    </div>
  );
}
