export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-2 px-2">
      {/* Bot avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tg-accent to-blue-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-lg">
        A
      </div>
      <div className="bg-tg-bubble rounded-2xl rounded-bl-sm px-4 py-3 shadow-md max-w-xs">
        <div className="flex items-center gap-1">
          <div className="typing-dot w-2 h-2 rounded-full bg-tg-subtext"></div>
          <div className="typing-dot w-2 h-2 rounded-full bg-tg-subtext"></div>
          <div className="typing-dot w-2 h-2 rounded-full bg-tg-subtext"></div>
        </div>
      </div>
    </div>
  );
}
