import { TemplateConfig, ToneType } from '@/types/textGenerator';

export const toneOptions: { value: ToneType; label: string; description: string }[] = [
  { value: 'formal', label: 'Formal', description: 'Bahasa baku, profesional' },
  { value: 'semi-formal', label: 'Semi Formal', description: 'Tetap sopan, lebih santai' },
  { value: 'santai', label: 'Santai', description: 'Bahasa sehari-hari, friendly' },
  { value: 'genz', label: 'Gen Z', description: 'Gaul, kekinian, viral-ready' },
  { value: 'corporate', label: 'Corporate', description: 'Bisnis, profesional, meyakinkan' },
  { value: 'jurnalistik', label: 'Jurnalistik', description: 'Netral, faktual, informatif' },
];

export const templateConfigs: TemplateConfig[] = [
  {
    id: 'tiktok-60s',
    name: 'Video Script 60 Detik',
    description: 'Template edukasi ringkas untuk TikTok/Reels',
    durationRange: '30-60 detik',
    platform: 'TikTok / Reels',
    fields: [
      { id: 'topik', label: 'Topik', type: 'text', placeholder: 'Contoh: Gerhana Bulan', required: true },
      { id: 'targetAudiens', label: 'Target Audiens', type: 'text', placeholder: 'Contoh: Remaja 15-25 tahun, perkotaan' },
      { 
        id: 'tujuan', 
        label: 'Tujuan', 
        type: 'select',
        options: [
          { value: 'edukasi', label: 'Edukasi' },
          { value: 'awareness', label: 'Awareness' },
          { value: 'soft-sell', label: 'Soft Selling' },
        ]
      },
      { 
        id: 'cta', 
        label: 'CTA', 
        type: 'select',
        options: [
          { value: 'follow', label: 'Follow' },
          { value: 'komentar', label: 'Komentar' },
          { value: 'klik-link', label: 'Klik Link' },
          { value: 'share', label: 'Share' },
        ]
      },
    ],
    structure: [
      { id: 'hook', name: 'Hook', timing: '0-3 detik', description: '1 kalimat pendek, bikin penasaran' },
      { id: 'context', name: 'Context', timing: '3-10 detik', description: '1-2 kalimat: "ini penting karena…"' },
      { id: 'isi-1', name: 'Isi Poin 1', timing: '10-25 detik', description: '1-2 kalimat' },
      { id: 'isi-2', name: 'Isi Poin 2', timing: '25-35 detik', description: '1-2 kalimat' },
      { id: 'isi-3', name: 'Isi Poin 3', timing: '35-45 detik', description: '1-2 kalimat' },
      { id: 'analogi', name: 'Contoh/Analogi', timing: '45-55 detik', description: '1 contoh dekat dengan hidup sehari-hari' },
      { id: 'closing', name: 'Closing + CTA', timing: '55-60 detik', description: '1 kalimat penutup + CTA' },
    ],
  },
  {
    id: 'reels-30s',
    name: 'Reels 30 Detik',
    description: 'Script cepat untuk Instagram Reels',
    durationRange: '15-30 detik',
    platform: 'Instagram Reels',
    fields: [
      { id: 'topik', label: 'Topik', type: 'text', placeholder: 'Topik utama konten', required: true },
      { id: 'pesan-utama', label: 'Pesan Utama', type: 'text', placeholder: 'Satu pesan yang ingin disampaikan' },
      { id: 'cta', label: 'CTA', type: 'text', placeholder: 'Contoh: Save untuk nanti!' },
    ],
    structure: [
      { id: 'hook', name: 'Hook', timing: '0-3 detik', description: 'Pembuka yang menarik perhatian' },
      { id: 'isi', name: 'Isi Utama', timing: '3-20 detik', description: 'Poin-poin kunci' },
      { id: 'closing', name: 'Closing', timing: '20-30 detik', description: 'Penutup + CTA' },
    ],
  },
  {
    id: 'jurnalistik-90s',
    name: 'Script Jurnalistik 90 Detik',
    description: 'Berita/update dengan gaya jurnalistik',
    durationRange: '60-90 detik',
    platform: 'Berita / Update',
    fields: [
      { id: 'headline', label: 'Headline', type: 'text', placeholder: 'Judul berita', required: true },
      { id: 'fakta', label: 'Poin Fakta', type: 'bullets', placeholder: 'Masukkan fakta-fakta kunci', maxBullets: 5 },
      { id: 'sumber', label: 'Sumber (opsional)', type: 'text', placeholder: 'Sumber informasi' },
    ],
    structure: [
      { id: 'lead', name: 'Lead', description: '1 kalimat: siapa-apa-kapan-di mana' },
      { id: 'fakta-kunci', name: 'Fakta Kunci', description: '3 bullet poin fakta' },
      { id: 'dampak', name: 'Dampak/Implikasi', description: '2 bullet poin dampak' },
      { id: 'berikutnya', name: 'Apa Berikutnya', description: '1 kalimat outlook' },
      { id: 'cta', name: 'CTA (Opsional)', description: 'Call to action' },
    ],
  },
  {
    id: 'umkm-soft-sell',
    name: 'Soft Selling UMKM',
    description: 'Script promosi produk 30-45 detik',
    durationRange: '30-45 detik',
    platform: 'TikTok / Reels / Story',
    fields: [
      { id: 'produk', label: 'Nama Produk', type: 'text', placeholder: 'Nama produk/jasa', required: true },
      { id: 'masalah', label: 'Masalah Audiens', type: 'text', placeholder: 'Masalah yang dipecahkan produk' },
      { id: 'benefit', label: 'Benefit Utama', type: 'bullets', placeholder: 'Keunggulan produk', maxBullets: 3 },
      { id: 'bukti-sosial', label: 'Bukti Sosial', type: 'text', placeholder: 'Testimoni atau angka penjualan' },
      { id: 'promo', label: 'Promo/CTA', type: 'text', placeholder: 'Penawaran khusus' },
    ],
    structure: [
      { id: 'hook', name: 'Hook Problem', description: 'Masalah yang relate' },
      { id: 'solusi', name: 'Solusi (Produk)', description: 'Perkenalan produk' },
      { id: 'benefit', name: 'Benefit 1-3', description: 'Keunggulan utama' },
      { id: 'bukti', name: 'Bukti Sosial', description: 'Testimoni/angka' },
      { id: 'cta', name: 'CTA', description: 'Ajakan order' },
    ],
  },
  {
    id: 'carousel-ig',
    name: 'Carousel IG (7 Slide)',
    description: 'Konten edukasi carousel Instagram',
    durationRange: '7 slide',
    platform: 'Instagram Carousel',
    fields: [
      { id: 'topik', label: 'Topik', type: 'text', placeholder: 'Topik utama carousel', required: true },
      { id: 'poin-utama', label: '5 Poin Utama', type: 'bullets', placeholder: 'Poin-poin yang akan dibahas', maxBullets: 5 },
      { id: 'cta', label: 'CTA', type: 'text', placeholder: 'Ajakan di akhir' },
    ],
    structure: [
      { id: 'slide-1', name: 'Slide 1: Cover', description: 'Judul + hook' },
      { id: 'slide-2', name: 'Slide 2: Masalah', description: '"Masalahnya…"' },
      { id: 'slide-3', name: 'Slide 3: Poin 1', description: 'Poin pertama' },
      { id: 'slide-4', name: 'Slide 4: Poin 2', description: 'Poin kedua' },
      { id: 'slide-5', name: 'Slide 5: Poin 3', description: 'Poin ketiga' },
      { id: 'slide-6', name: 'Slide 6: Poin 4', description: 'Poin keempat' },
      { id: 'slide-7', name: 'Slide 7: CTA', description: 'Ringkasan + CTA' },
    ],
  },
  {
    id: 'youtube-3m',
    name: 'Script YouTube 3-5 Menit',
    description: 'Script video YouTube dengan struktur lengkap',
    durationRange: '3-5 menit',
    platform: 'YouTube',
    fields: [
      { id: 'topik', label: 'Topik', type: 'text', placeholder: 'Topik video', required: true },
      { id: 'outline', label: 'Outline (3 bagian)', type: 'bullets', placeholder: 'Garis besar konten', maxBullets: 3 },
      { id: 'contoh-kasus', label: 'Contoh Kasus', type: 'textarea', placeholder: 'Contoh atau studi kasus' },
      { id: 'cta', label: 'CTA', type: 'text', placeholder: 'Subscribe, like, dll' },
    ],
    structure: [
      { id: 'intro', name: 'Intro', timing: '10-15 detik', description: 'Pembuka menarik' },
      { id: 'bagian-1', name: 'Bagian 1', timing: '1 menit', description: 'Poin pertama' },
      { id: 'bagian-2', name: 'Bagian 2', timing: '1-2 menit', description: 'Poin utama' },
      { id: 'bagian-3', name: 'Bagian 3', timing: '1 menit', description: 'Poin penutup' },
      { id: 'recap', name: 'Recap + CTA', timing: '15 detik', description: 'Ringkasan dan CTA' },
    ],
  },
  {
    id: 'voiceover-dokumenter',
    name: 'Voice Over Dokumenter',
    description: 'Narasi dokumenter dengan gaya storytelling',
    durationRange: '2-5 menit',
    platform: 'Video / Dokumenter',
    fields: [
      { id: 'topik', label: 'Topik', type: 'text', placeholder: 'Topik dokumenter', required: true },
      { id: 'setting', label: 'Setting/Latar', type: 'textarea', placeholder: 'Deskripsi setting' },
      { id: 'narasi-utama', label: 'Poin Narasi', type: 'bullets', placeholder: 'Poin-poin cerita', maxBullets: 5 },
    ],
    structure: [
      { id: 'opening', name: 'Opening', description: 'Pembuka atmosferik' },
      { id: 'konteks', name: 'Konteks', description: 'Latar belakang' },
      { id: 'isi', name: 'Isi Narasi', description: 'Cerita utama' },
      { id: 'klimaks', name: 'Klimaks/Insight', description: 'Puncak cerita' },
      { id: 'closing', name: 'Closing', description: 'Penutup reflektif' },
    ],
  },
  {
    id: 'presentasi',
    name: 'Script Presentasi',
    description: 'Script slide-by-slide untuk presentasi',
    durationRange: '5-15 menit',
    platform: 'Presentasi / Webinar',
    fields: [
      { id: 'judul', label: 'Judul Presentasi', type: 'text', placeholder: 'Judul', required: true },
      { id: 'tujuan', label: 'Tujuan', type: 'text', placeholder: 'Tujuan presentasi' },
      { id: 'poin-utama', label: 'Poin Utama', type: 'bullets', placeholder: 'Poin-poin presentasi', maxBullets: 5 },
      { id: 'audiens', label: 'Audiens', type: 'text', placeholder: 'Siapa audiensnya' },
    ],
    structure: [
      { id: 'pembuka', name: 'Slide Pembuka', description: 'Judul + ice breaker' },
      { id: 'agenda', name: 'Slide Agenda', description: 'Outline presentasi' },
      { id: 'isi', name: 'Slide Isi', description: 'Konten per slide' },
      { id: 'penutup', name: 'Slide Penutup', description: 'Ringkasan + Q&A' },
    ],
  },
];

export const durationToWords = (seconds: number): number => {
  // Average speaking rate: 130-150 words per minute in Indonesian
  // Using 140 wpm as baseline
  return Math.round((seconds / 60) * 140);
};

export const wordsToDuration = (words: number): number => {
  return Math.round((words / 140) * 60);
};

export const durationPresets = [
  { value: 15, label: '15 detik', words: durationToWords(15) },
  { value: 30, label: '30 detik', words: durationToWords(30) },
  { value: 60, label: '60 detik', words: durationToWords(60) },
  { value: 90, label: '90 detik', words: durationToWords(90) },
  { value: 180, label: '3 menit', words: durationToWords(180) },
  { value: 300, label: '5 menit', words: durationToWords(300) },
];

export const outputFormatOptions = [
  { value: 'paragraf', label: 'Paragraf', description: 'Teks mengalir' },
  { value: 'bullet', label: 'Bullet Points', description: 'Poin-poin terpisah' },
  { value: 'dialog', label: 'Dialog', description: 'Format percakapan' },
  { value: 'scene-by-scene', label: 'Scene by Scene', description: 'Per adegan dengan deskripsi visual' },
];
