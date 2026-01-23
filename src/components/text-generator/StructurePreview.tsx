import { TemplateConfig } from '@/types/textGenerator';
import { cn } from '@/lib/utils';

interface StructurePreviewProps {
  template: TemplateConfig;
}

export const StructurePreview = ({ template }: StructurePreviewProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Struktur Output</label>
      <div className="rounded-lg border border-border bg-secondary/20 p-3">
        <div className="space-y-2">
          {template.structure.map((section, index) => (
            <div 
              key={section.id}
              className="flex items-start gap-3 rounded-md bg-secondary/30 p-2"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{section.name}</span>
                  {section.timing && (
                    <span className="text-[10px] text-muted-foreground">({section.timing})</span>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
