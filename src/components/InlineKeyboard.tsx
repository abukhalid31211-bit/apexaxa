import { Button } from '../types';

interface InlineKeyboardProps {
  buttons: Button[][];
  onButtonClick: (action: string, label: string) => void;
  disabled?: boolean;
}

const colorClasses: Record<string, string> = {
  default: 'bg-tg-button hover:bg-tg-buttonHover text-tg-accentLight',
  green: 'bg-green-700 hover:bg-green-600 text-white',
  red: 'bg-red-700 hover:bg-red-600 text-white',
  gold: 'bg-yellow-600 hover:bg-yellow-500 text-black',
};

export default function InlineKeyboard({ buttons, onButtonClick, disabled }: InlineKeyboardProps) {
  return (
    <div className="flex flex-col gap-1 mt-2 px-10">
      {buttons.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.map((btn, btnIdx) => (
            <button
              key={btnIdx}
              onClick={() => !disabled && onButtonClick(btn.action, btn.label)}
              disabled={disabled}
              className={`
                tg-button flex-1 text-xs sm:text-sm py-2 px-3 rounded-xl
                font-medium transition-all duration-150
                ${colorClasses[btn.color || 'default']}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                text-center leading-tight min-h-[38px]
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
