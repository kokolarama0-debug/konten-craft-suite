import { templateConfigs } from '@/data/templateConfigs';
import { TemplateType } from '@/types/textGenerator';
import { cn } from '@/lib/utils';
import { Clock, FileText, Video, Mic, Image, Presentation, Radio, ShoppingBag } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

const templateIcons: Record<TemplateType, React.ComponentType<{ className?: string }>> = {
  'tiktok-60s': Video,
  'reels-30s': Video,
  'youtube-3m': Video,
  'jurnalistik-90s': Radio,
  'umkm-soft-sell': ShoppingBag,
  'carousel-ig': Image,
  'voiceover-dokumenter': Mic,
  'presentasi': Presentation,
  'custom': FileText,
};

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Pilih Template</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {templateConfigs.map((template) => {
          const Icon = templateIcons[template.id] || FileText;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all",
                "hover:border-primary/50 hover:bg-secondary/50",
                isSelected 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-secondary/30"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <Icon className={cn(
                  "h-4 w-4",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{template.durationRange}</span>
                </div>
              </div>
              <div>
                <h4 className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {template.name}
                </h4>
                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
                  {template.platform}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
