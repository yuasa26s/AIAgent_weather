// components/ui/HeroIllustrations.tsx
import Image from "next/image";

export default function Illustrations() {
  return (
    <div className="flex-1 flex items-center justify-center gap-4 md:gap-12 z-10 mb-16 max-w-7xl w-full px-4">
      {/* 1枚目*/}
      <div className="flex-1 flex justify-center transition-transform hover:scale-105">
        <Image
          src="/images/image_rain.png"
          alt="雨の日のコーデ"
          width={250}
          height={250}
          className="object-contain blend-screen"
        />
      </div>

      {/* 2枚目: 背中合わせの男女 (中央) */}
      <div className="flex-1 flex justify-center transition-transform hover:scale-105">
        <Image
          src="/images/image_1.png"
          alt="メインのコーデ"
          width={320}
          height={320}
          className="object-contain blend-screen"
        />
      </div>

      {/* 3枚目: キャリーバッグを引く男性 */}
      <div className="flex-1 flex justify-center transition-transform hover:scale-105">
        <Image
          src="/images/image_travel.png"
          alt="旅行のコーデ"
          width={250}
          height={250}
          className="object-contain blend-screen"
        />
      </div>
    </div>
  );
}
