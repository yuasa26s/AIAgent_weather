"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-milky-blue flex flex-col items-center justify-between pt-32 pb-20 px-6 text-white">
      {/*タイトル */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-7xl font-sans font-bold tracking-tight drop-shadow-md">
          コーデ日和
        </h1>
        <p className="text-lg font-medium opacity-90">今日の服装をご提案</p>
      </div>

      {/*ボタン */}
      <div className="w-full flex justify-center">
        <button className="bg-sunny-yellow text-charcoal-gray text-xl px-12 py-4 rounded-full font-bold shadow-xl active:scale-90 transition-all">
          タップ
        </button>
      </div>
    </main>
  );
}
