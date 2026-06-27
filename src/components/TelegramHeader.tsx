interface TelegramHeaderProps {
  onMenuClick: () => void;
}

export default function TelegramHeader({ onMenuClick }: TelegramHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-tg-header border-b border-tg-divider flex-shrink-0">
      {/* Back button (decorative) */}
      <button className="text-tg-accent hover:text-tg-accentLight transition-colors p-1">
        <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
          <path d="M8 1L1 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      </button>

      {/* Bot avatar */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tg-accent to-blue-800 flex items-center justify-center text-white font-bold text-base shadow-lg">
          ⚡
        </div>
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-tg-green border-2 border-tg-header"></div>
      </div>

      {/* Bot name + status */}
      <div className="flex-1 min-w-0">
        <h1 className="text-tg-text font-semibold text-sm truncate">APEX Trading Bot</h1>
        <p className="text-tg-green text-xs">online</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="text-tg-subtext hover:text-tg-text transition-colors p-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        {/* Menu */}
        <button onClick={onMenuClick} className="text-tg-subtext hover:text-tg-text transition-colors p-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
