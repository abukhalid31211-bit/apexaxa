import React from 'react';

interface MessageBubbleProps {
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
  isLatest?: boolean;
}

function parseText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|━+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i} className="text-tg-subtext">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="font-mono text-tg-accentLight bg-white/10 px-1 rounded text-sm">{part.slice(1, -1)}</code>;
    }
    if (/^━+$/.test(part)) {
      return <span key={i} className="block border-b border-white/10 my-1"></span>;
    }
    return <span key={i}>{part}</span>;
  });
}

function formatMessage(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <span key={i}>
      {parseText(line)}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

export default function MessageBubble({ type, text, timestamp, isLatest }: MessageBubbleProps) {
  const timeStr = timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  if (type === 'user') {
    return (
      <div className={`flex justify-start items-end gap-2 mb-1 px-2 ${isLatest ? 'message-enter' : ''}`}>
        <div className="bg-tg-bubbleOut rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs lg:max-w-sm shadow-md">
          <p className="text-tg-text text-sm leading-relaxed">{text}</p>
          <p className="text-tg-subtext text-xs mt-1 text-left">{timeStr}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 mb-2 px-2 ${isLatest ? 'message-enter' : ''}`}>
      {/* Bot avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tg-accent to-blue-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-lg mb-1">
        ⚡
      </div>
      <div className="bg-tg-bubble rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-md">
        <div className="text-tg-text text-sm leading-relaxed whitespace-pre-line">
          {formatMessage(text)}
        </div>
        <p className="text-tg-subtext text-xs mt-2 text-left">{timeStr} ✓✓</p>
      </div>
    </div>
  );
}
