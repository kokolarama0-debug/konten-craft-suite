import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Video, Upload, X, Clock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface UploadedVideo {
  id: string;
  file: File;
  src: string;
  name: string;
  duration: number;
  thumbnailUrl?: string;
}

interface VideoSourceSelectorProps {
  uploadedVideo?: UploadedVideo;
  onVideoUpload: (video: UploadedVideo) => void;
  onVideoRemove: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const VideoSourceSelector = ({
  uploadedVideo,
  onVideoUpload,
  onVideoRemove,
}: VideoSourceSelectorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getVideoDuration = (file: File): Promise<{ duration: number; thumbnailUrl: string }> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      
      video.addEventListener('loadedmetadata', () => {
        // Generate thumbnail
        video.currentTime = 1; // Seek to 1 second for thumbnail
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        URL.revokeObjectURL(url);
        resolve({ duration: video.duration, thumbnailUrl });
      });

      video.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video'));
      });
    });
  };

  const handleFile = async (file: File) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    
    if (!validTypes.some(t => file.type === t || file.type.includes('video'))) {
      toast({
        title: "Format tidak didukung",
        description: "Upload file MP4, WebM, atau MOV",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "File terlalu besar",
        description: "Maksimal 500MB",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { duration, thumbnailUrl } = await getVideoDuration(file);
      const videoUrl = URL.createObjectURL(file);
      
      onVideoUpload({
        id: `video-${Date.now()}`,
        file,
        src: videoUrl,
        name: file.name,
        duration,
        thumbnailUrl,
      });

      toast({
        title: "Video berhasil diupload",
        description: `Durasi: ${formatDuration(duration)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal memproses video",
        description: "Coba file lain",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Video className="h-4 w-4" />
        Upload Video
      </Label>
      <p className="mb-4 text-xs text-muted-foreground">
        Upload video untuk digabung atau diedit
      </p>

      {!uploadedVideo ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-all",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border bg-secondary/30 hover:bg-secondary/50",
            isProcessing && "pointer-events-none opacity-50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
          />
          
          {isProcessing ? (
            <>
              <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Memproses video...</p>
            </>
          ) : (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Drop video atau klik untuk upload</p>
              <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV (maks 500MB)</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-border">
            {uploadedVideo.thumbnailUrl ? (
              <img 
                src={uploadedVideo.thumbnailUrl} 
                alt={uploadedVideo.name}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <video 
                src={uploadedVideo.src}
                className="w-full aspect-video object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="h-12 w-12 text-white" />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onVideoRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 min-w-0">
              <Video className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">{uploadedVideo.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(uploadedVideo.duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
