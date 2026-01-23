import { toneOptions } from '@/data/templateConfigs';
import { ToneType } from '@/types/textGenerator';
import { cn } from '@/lib/utils';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onSelectTone: (tone: ToneType) => void;
}

export const ToneSelector = ({ selectedTone, onSelectTone }: ToneSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Gaya Bahasa</label>
      <div className="flex flex-wrap gap-2">
        {toneOptions.map((tone) => {
          const isSelected = selectedTone === tone.value;
          
          return (
            <button
              key={tone.value}
              onClick={() => onSelectTone(tone.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              title={tone.description}
            >
              {tone.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
