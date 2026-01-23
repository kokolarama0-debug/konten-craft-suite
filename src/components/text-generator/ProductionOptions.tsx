import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { ChevronDown, FileText, Hash, Eye, Camera, Subtitles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductionOutputOptions {
  includeCaption: boolean;
  includeHashtags: boolean;
  includeOnScreenText: boolean;
  includeShotList: boolean;
  includeSubtitleFriendly: boolean;
}

interface ProductionOptionsProps {
  options: ProductionOutputOptions;
  onChange: (options: ProductionOutputOptions) => void;
}

export const ProductionOptions = ({ options, onChange }: ProductionOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (key: keyof ProductionOutputOptions) => {
    onChange({ ...options, [key]: !options[key] });
  };

  const optionItems = [
    { key: 'includeCaption' as const, label: 'Caption', icon: FileText, description: 'Caption untuk posting sosmed' },
    { key: 'includeHashtags' as const, label: 'Hashtags', icon: Hash, description: 'Hashtag relevan' },
    { key: 'includeOnScreenText' as const, label: 'On-Screen Text', icon: Eye, description: 'Teks yang muncul di layar' },
    { key: 'includeShotList' as const, label: 'Shot List', icon: Camera, description: 'Saran visual & B-roll' },
    { key: 'includeSubtitleFriendly' as const, label: 'Subtitle Friendly', icon: Subtitles, description: 'Versi kalimat pendek' },
  ];

  const activeCount = Object.values(options).filter(Boolean).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 text-left transition-all hover:bg-secondary/50">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Output Produksi</span>
            {activeCount > 0 && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                {activeCount} aktif
              </span>
            )}
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
          {optionItems.map(({ key, label, icon: Icon, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">{label}</Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <Switch
                checked={options[key]}
                onCheckedChange={() => toggleOption(key)}
              />
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type { ProductionOutputOptions };
