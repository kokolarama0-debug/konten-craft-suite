import { outputFormatOptions } from '@/data/templateConfigs';
import { OutputFormat } from '@/types/textGenerator';
import { cn } from '@/lib/utils';
import { AlignLeft, List, MessageSquare, Clapperboard } from 'lucide-react';

interface OutputFormatSelectorProps {
  selectedFormat: OutputFormat;
  onSelectFormat: (format: OutputFormat) => void;
}

const formatIcons: Record<OutputFormat, React.ComponentType<{ className?: string }>> = {
  'paragraf': AlignLeft,
  'bullet': List,
  'dialog': MessageSquare,
  'scene-by-scene': Clapperboard,
};

export const OutputFormatSelector = ({ selectedFormat, onSelectFormat }: OutputFormatSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Format Output</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {outputFormatOptions.map((format) => {
          const Icon = formatIcons[format.value as OutputFormat];
          const isSelected = selectedFormat === format.value;
          
          return (
            <button
              key={format.value}
              onClick={() => onSelectFormat(format.value as OutputFormat)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{format.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
