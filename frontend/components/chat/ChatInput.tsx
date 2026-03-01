// components/chat/ChatInput.tsx
export default function ChatInput() {
  return (
    <div className="w-full flex gap-2 items-center bg-white/50 p-2 rounded-full border border-white/30 shadow-inner">
      <input
        type="text"
        placeholder="メッセージを入力..."
        className="flex-1 bg-transparent px-4 py-2 outline-none text-charcoal-gray placeholder:text-charcoal-gray/50 font-bold"
      />
      <button className="bg-sunny-yellow p-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform">
        <span className="text-xl">✈️</span>
      </button>
    </div>
  );
}
