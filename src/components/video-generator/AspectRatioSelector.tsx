 import { Label } from "@/components/ui/label";
 import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
 import { Monitor, Smartphone, Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
 
 export type VideoAspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '4:5';
 
 interface AspectRatioSelectorProps {
   aspectRatio: VideoAspectRatio;
   onAspectRatioChange: (ratio: VideoAspectRatio) => void;
 }
 
 const aspectRatioOptions: { value: VideoAspectRatio; label: string; icon: React.ElementType; description: string }[] = [
   { value: '16:9', label: '16:9', icon: Monitor, description: 'YouTube, TV' },
   { value: '9:16', label: '9:16', icon: Smartphone, description: 'Reels, TikTok' },
   { value: '1:1', label: '1:1', icon: Square, description: 'Instagram' },
   { value: '4:3', label: '4:3', icon: RectangleHorizontal, description: 'Classic' },
   { value: '4:5', label: '4:5', icon: RectangleVertical, description: 'Portrait' },
 ];
 
 export const getAspectRatioDimensions = (ratio: VideoAspectRatio): { width: number; height: number } => {
   switch (ratio) {
     case '16:9':
       return { width: 1920, height: 1080 };
     case '9:16':
       return { width: 1080, height: 1920 };
     case '1:1':
       return { width: 1080, height: 1080 };
     case '4:3':
       return { width: 1440, height: 1080 };
     case '4:5':
       return { width: 1080, height: 1350 };
     default:
       return { width: 1920, height: 1080 };
   }
 };
 
 export const AspectRatioSelector = ({
   aspectRatio,
   onAspectRatioChange,
 }: AspectRatioSelectorProps) => {
   return (
     <div className="glass-card rounded-xl p-4">
       <Label className="mb-3 block text-sm font-medium text-foreground">
         Aspect Ratio
       </Label>
       <ToggleGroup
         type="single"
         value={aspectRatio}
         onValueChange={(value) => value && onAspectRatioChange(value as VideoAspectRatio)}
         className="flex flex-wrap gap-2"
       >
         {aspectRatioOptions.map((option) => (
           <ToggleGroupItem
             key={option.value}
             value={option.value}
             className="flex flex-col items-center gap-1 h-auto py-2 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
           >
             <option.icon className="h-4 w-4" />
             <span className="text-xs font-medium">{option.label}</span>
             <span className="text-[10px] opacity-70">{option.description}</span>
           </ToggleGroupItem>
         ))}
       </ToggleGroup>
     </div>
   );
 };