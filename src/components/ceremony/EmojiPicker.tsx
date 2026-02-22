'use client';

export default function EmojiPicker({
  options,
  value,
  onChange,
  label = 'Your chosen marker',
}: {
  options: string[];
  value: string | null;
  onChange: (emoji: string) => void;
  label?: string;
}) {
  return (
    <div>
      <span className="block text-sm font-medium text-text/80 mb-2">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={
              value === emoji
                ? 'w-10 h-10 rounded-lg border-2 border-primary bg-primary/20 text-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary'
                : 'w-10 h-10 rounded-lg border-2 border-surface/50 bg-surface/20 text-xl flex items-center justify-center hover:border-surface text-text focus:outline-none focus:ring-2 focus:ring-primary'
            }
            aria-label={'Select ' + emoji}
            aria-pressed={value === emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
