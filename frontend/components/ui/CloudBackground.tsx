//雲パーツをまとめたコンポーネント
"use client";

const Cloud = ({
  speed,
  top,
  opacity,
  size = 150,
}: {
  speed: number;
  top: number;
  opacity: number;
  size?: number;
}) => (
  <svg
    className="absolute animate-cloud"
    style={{
      top: `${top}%`,
      animationDuration: `${speed}s`,
      opacity: opacity,
    }}
    width={size}
    viewBox="0 0 100 60"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="25" cy="35" r="15" />
    <circle cx="45" cy="30" r="20" />
    <circle cx="70" cy="35" r="15" />
    <rect x="25" y="35" width="45" height="15" />
  </svg>
);

export default function CloudBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Cloud speed={20} top={10} opacity={0.6} size={180} />
      <Cloud speed={35} top={30} opacity={0.4} size={120} />
      <Cloud speed={25} top={55} opacity={0.5} size={200} />
      <Cloud speed={45} top={75} opacity={0.3} size={150} />
    </div>
  );
}
