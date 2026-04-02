import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PageHeader = ({ icon: Icon, title, description }: PageHeaderProps) => {
  return (
    <div className="mb-6 md:mb-8 animate-fade-in">
      <div className="flex items-center gap-2.5 md:gap-3">
        <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
          <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-lg md:text-2xl font-bold text-foreground truncate">{title}</h1>
          <p className="text-xs md:text-sm text-muted-foreground truncate">{description}</p>
        </div>
      </div>
    </div>
  );
};
