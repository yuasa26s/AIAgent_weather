type OutfitProps = {
  items?: string[];
  suggestion?: string;
};

export default function OutfitCard({
  items = [],
  suggestion = "今日のコーデを読み込み中...",
}: OutfitProps) {
  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-[30px] shadow-xl border-4 border-white/20 w-full max-w-md">
      <p className="text-slate-600 text-sm font-bold mb-4 leading-relaxed">
        💡 {suggestion}
      </p>
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white/50 px-4 py-2 rounded-full border border-white/40 shadow-sm"
          >
            <span className="text-slate-700 text-sm font-extrabold">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
