// components/chat/MessageBubble.tsx
interface MessageProps {
  text: string;
  isAi?: boolean;
}

export default function MessageBubble({ text, isAi = false }: MessageProps) {
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`px-5 py-3 rounded-[25px] font-bold shadow-sm max-w-[85%] 
        ${
          isAi
            ? "bg-soft-white text-gray-600 rounded-tl-none"
            : "bg-sakura-pink text-gray-700 rounded-tr-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
