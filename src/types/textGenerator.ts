// Types for Text Generator

export type ToneType = 'formal' | 'semi-formal' | 'santai' | 'genz' | 'corporate' | 'jurnalistik';

export type TemplateType = 
  | 'tiktok-60s'
  | 'reels-30s'
  | 'youtube-3m'
  | 'jurnalistik-90s'
  | 'umkm-soft-sell'
  | 'carousel-ig'
  | 'voiceover-dokumenter'
  | 'presentasi'
  | 'custom';

export type OutputFormat = 'paragraf' | 'bullet' | 'dialog' | 'scene-by-scene';

export type ContentGoal = 'edukasi' | 'penjualan' | 'awareness' | 'hiburan';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  durationRange: string;
  platform: string;
  fields: TemplateField[];
  structure: StructureSection[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'bullets';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  maxBullets?: number;
}

export interface StructureSection {
  id: string;
  name: string;
  timing?: string;
  description: string;
}

export interface BrandVoice {
  targetAudience: {
    age: string;
    location: string;
    segment: string;
  };
  goal: ContentGoal;
  brandName: string;
  doWords: string[];
  dontWords: string[];
  glossary: { term: string; definition: string }[];
}

export interface GeneratedContent {
  id: string;
  templateId: TemplateType;
  content: {
    mainScript: string;
    caption?: string;
    hashtags?: string[];
    onScreenText?: string[];
    shotList?: string[];
    subtitleFriendly?: string;
  };
  metadata: {
    duration: number;
    wordCount: number;
    tone: ToneType;
    format: OutputFormat;
  };
  createdAt: Date;
  updatedAt: Date;
  title: string;
  isDraft: boolean;
}

export interface DraftHistory {
  id: string;
  title: string;
  templateId: TemplateType;
  content: GeneratedContent;
  createdAt: Date;
  updatedAt: Date;
}
