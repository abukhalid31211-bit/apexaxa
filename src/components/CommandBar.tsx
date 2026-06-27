import { useState } from 'react';

interface CommandBarProps {
  onCommand: (cmd: string) => void;
}

const COMMANDS = [
  { cmd: '/start', label: 'البداية' },
  { cmd: '/menu', label: 'القائمة' },
  { cmd: '/signals', label: 'الإشارات' },
  { cmd: '/analysis', label: 'التحليلات' },
  { cmd: '/portfolio', label: 'المحفظة' },
  { cmd: '/risk', label: 'المخاطر' },
  { cmd: '/calendar', label: 'التقويم' },
  { cmd: '/learn', label: 'التعليم' },
  { cmd: '/social', label: 'الاجتماعي' },
  { cmd: '/subscribe', label: 'الاشتراك' },
  { cmd: '/settings', label: 'الإعدادات' },
  { cmd: '/refer', label: 'الإحالة' },
  { cmd: '/support', label: 'الدعم' },
  { cmd: '/news', label: 'الأخبار' },
  { cmd: '/status', label: 'الحالة' },
  { cmd: '/connect', label: 'ربط المنصات' },
  { cmd: '/help', label: 'المساعدة' },
];

export default function CommandBar({ onCommand }: CommandBarProps) {
  const [showCommands, setShowCommands] = useState(false);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const filteredCommands = COMMANDS.filter(c =>
    c.cmd.includes(input.toLowerCase()) || c.label.includes(input)
  );

  return (
    <div className="relative border-t border-tg-divider bg-tg-header flex-shrink-0">
      {/* Command suggestions */}
      {showCommands && input.startsWith('/') && (
        <div className="absolute bottom-full w-full bg-tg-bg border border-tg-divider rounded-t-xl max-h-48 overflow-y-auto z-10">
          {filteredCommands.map(({ cmd, label }) => (
            <button
              key={cmd}
              onClick={() => { onCommand(cmd); setInput(''); setShowCommands(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-tg-bubble transition-colors text-right"
            >
              <span className="text-tg-accent font-mono text-sm">{cmd}</span>
              <span className="text-tg-subtext text-xs">{label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2">
        {/* Attachment icon */}
        <button className="text-tg-subtext hover:text-tg-accent transition-colors p-1.5 flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        {/* Input */}
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setShowCommands(true); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowCommands(true)}
            onBlur={() => setTimeout(() => setShowCommands(false), 200)}
            placeholder="اكتب أمراً أو رسالة... مثل /start"
            className="w-full bg-tg-bubble text-tg-text text-sm placeholder-tg-subtext rounded-2xl px-4 py-2.5 outline-none border border-transparent focus:border-tg-accent/30 transition-all"
          />
        </div>

        {/* Emoji */}
        <button className="text-tg-subtext hover:text-tg-accent transition-colors p-1.5 flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </button>

        {/* Send / Mic */}
        {input.trim() ? (
          <button
            onClick={handleSend}
            className="bg-tg-accent hover:bg-tg-accentLight text-white rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 transition-colors shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        ) : (
          <button className="text-tg-subtext hover:text-tg-accent transition-colors p-1.5 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
