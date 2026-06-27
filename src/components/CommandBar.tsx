import { useState, useRef, useEffect } from 'react';

interface CommandBarProps {
  onCommand: (cmd: string) => void;
}

const COMMANDS = [
  { cmd: '/start', label: 'البداية', icon: '🚀' },
  { cmd: '/menu', label: 'القائمة الرئيسية', icon: '🏠' },
  { cmd: '/signals', label: 'الإشارات الحية', icon: '📡' },
  { cmd: '/analysis', label: 'التحليلات اليومية', icon: '☀️' },
  { cmd: '/portfolio', label: 'لوحة التحكم', icon: '📊' },
  { cmd: '/risk', label: 'إدارة المخاطر', icon: '🛡️' },
  { cmd: '/calendar', label: 'التقويم الاقتصادي', icon: '📅' },
  { cmd: '/learn', label: 'الأكاديمية التعليمية', icon: '🎓' },
  { cmd: '/social', label: 'التداول الاجتماعي', icon: '👥' },
  { cmd: '/subscribe', label: 'خطط الاشتراك', icon: '💎' },
  { cmd: '/settings', label: 'الإعدادات', icon: '⚙️' },
  { cmd: '/refer', label: 'برنامج الإحالة', icon: '🎁' },
  { cmd: '/support', label: 'الدعم الفني', icon: '🆘' },
  { cmd: '/news', label: 'آخر الأخبار', icon: '📰' },
  { cmd: '/status', label: 'حالة حسابك', icon: '👤' },
  { cmd: '/connect', label: 'ربط منصات التداول', icon: '🔗' },
  { cmd: '/calc', label: 'حاسبة الصفقات', icon: '🧮' },
  { cmd: '/help', label: 'دليل الاستخدام', icon: '📖' },
];

export default function CommandBar({ onCommand }: CommandBarProps) {
  const [showCommands, setShowCommands] = useState(false);
  const [input, setInput] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
    if (e.key === 'Escape') setShowCommands(false);
  };

  const filteredCommands = input.startsWith('/')
    ? COMMANDS.filter(c =>
        c.cmd.includes(input.toLowerCase()) || c.label.includes(input)
      )
    : COMMANDS;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        menuBtnRef.current && !menuBtnRef.current.contains(e.target as Node)
      ) {
        setShowCommands(false);
      }
    };
    if (showCommands) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCommands]);

  return (
    <div className="relative border-t border-tg-divider bg-tg-header flex-shrink-0">
      {/* Commands popup — Telegram bot menu style */}
      {showCommands && (
        <div
          ref={popupRef}
          className="absolute bottom-full left-0 right-0 bg-tg-bg border border-tg-divider rounded-t-2xl shadow-2xl overflow-hidden z-20"
        >
          {/* Popup header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-tg-divider bg-tg-header">
            <span className="text-tg-subtext text-xs font-medium">أوامر البوت</span>
            <span className="text-tg-accent font-semibold text-sm">APEX Bot</span>
          </div>

          {/* Commands list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCommands.map(({ cmd, label, icon }) => (
              <button
                key={cmd}
                onMouseDown={() => {
                  onCommand(cmd);
                  setInput('');
                  setShowCommands(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-tg-bubble transition-colors text-right border-b border-tg-divider/40 last:border-0"
              >
                <span className="text-base w-7 text-center flex-shrink-0">{icon}</span>
                <div className="flex flex-col flex-1 text-right">
                  <span className="text-tg-accent font-mono text-sm font-medium">{cmd}</span>
                  <span className="text-tg-subtext text-xs mt-0.5">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2">
        {/* Blue Telegram-style Menu Button */}
        <button
          ref={menuBtnRef}
          onClick={() => setShowCommands(prev => !prev)}
          title="أوامر البوت"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0 transition-all ${
            showCommands
              ? 'bg-tg-accent text-white shadow-md'
              : 'bg-tg-accent/90 hover:bg-tg-accent text-white'
          }`}
        >
          {/* Hamburger / menu icon */}
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
            <rect x="0" y="0" width="15" height="2" rx="1" fill="currentColor"/>
            <rect x="0" y="5" width="15" height="2" rx="1" fill="currentColor"/>
            <rect x="0" y="10" width="15" height="2" rx="1" fill="currentColor"/>
          </svg>
          <span className="text-xs font-medium leading-none hidden sm:inline">قائمة</span>
        </button>

        {/* Input */}
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={e => {
              setInput(e.target.value);
              if (e.target.value.startsWith('/')) setShowCommands(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="اكتب أمراً أو رسالة..."
            dir="auto"
            className="w-full bg-tg-bubble text-tg-text text-sm placeholder-tg-subtext rounded-2xl px-4 py-2.5 outline-none border border-transparent focus:border-tg-accent/30 transition-all"
          />
        </div>

        {/* Send button — only shown when there's text */}
        {input.trim() && (
          <button
            onClick={handleSend}
            className="bg-tg-accent hover:bg-tg-accentLight text-white rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 transition-colors shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
