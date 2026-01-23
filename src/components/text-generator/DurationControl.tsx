import { Slider } from '@/components/ui/slider';
import { durationToWords } from '@/data/templateConfigs';
import { Clock, FileText } from 'lucide-react';

interface DurationControlProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  minDuration?: number;
  maxDuration?: number;
}

export const DurationControl = ({ 
  duration, 
  onDurationChange, 
  minDuration = 15,
  maxDuration = 300 
}: DurationControlProps) => {
  const wordCount = durationToWords(duration);
  
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds} detik`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 
      ? `${minutes} menit ${remainingSeconds} detik`
      : `${minutes} menit`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Durasi</label>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(duration)}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            ±{wordCount} kata
          </span>
        </div>
      </div>
      <Slider
        value={[duration]}
        onValueChange={([value]) => onDurationChange(value)}
        min={minDuration}
        max={maxDuration}
        step={5}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{formatDuration(minDuration)}</span>
        <span>{formatDuration(maxDuration)}</span>
      </div>
    </div>
  );
};
