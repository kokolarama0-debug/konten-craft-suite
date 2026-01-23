import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { GenerateButton } from "@/components/ui/GenerateButton";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "@/components/text-generator/TemplateSelector";
import { ToneSelector } from "@/components/text-generator/ToneSelector";
import { DurationControl } from "@/components/text-generator/DurationControl";
import { OutputFormatSelector } from "@/components/text-generator/OutputFormatSelector";
import { BrandVoicePanel } from "@/components/text-generator/BrandVoicePanel";
import { TemplateFields } from "@/components/text-generator/TemplateFields";
import { StructurePreview } from "@/components/text-generator/StructurePreview";
import { OutputSection } from "@/components/text-generator/OutputSection";
import { HistoryPanel } from "@/components/text-generator/HistoryPanel";
import { ProductionOptions, ProductionOutputOptions } from "@/components/text-generator/ProductionOptions";
import { templateConfigs, durationToWords } from "@/data/templateConfigs";
import { 
  TemplateType, 
  ToneType, 
  OutputFormat, 
  BrandVoice, 
  GeneratedContent,
  DraftHistory 
} from "@/types/textGenerator";
import { FileText, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const TextGenerator = () => {
  const { toast } = useToast();
  
  // Core state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('tiktok-60s');
  const [tone, setTone] = useState<ToneType>('santai');
  const [duration, setDuration] = useState(60);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('bullet');
  const [fieldValues, setFieldValues] = useState<Record<string, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  
  // Brand voice state
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({
    targetAudience: { age: '', location: '', segment: '' },
    goal: 'edukasi',
    brandName: '',
    doWords: [],
    dontWords: [],
    glossary: [],
  });
  
  // Production options state
  const [productionOptions, setProductionOptions] = useState<ProductionOutputOptions>({
    includeCaption: true,
    includeHashtags: true,
    includeOnScreenText: true,
    includeShotList: true,
    includeSubtitleFriendly: true,
  });
  
  // History/drafts state
  const [drafts, setDrafts] = useState<DraftHistory[]>([]);
  
  // Get current template config
  const currentTemplate = useMemo(() => 
    templateConfigs.find(t => t.id === selectedTemplate) || templateConfigs[0],
    [selectedTemplate]
  );

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleTemplateChange = (template: TemplateType) => {
    setSelectedTemplate(template);
    setFieldValues({});
    setGeneratedContent(null);
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleGenerate = async () => {
    // Validate required fields
    const requiredFields = currentTemplate.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => {
      const value = fieldValues[f.id];
      return !value || (Array.isArray(value) ? value.length === 0 : value.trim() === '');
    });

    if (missingFields.length > 0) {
      toast({
        title: "Field wajib belum diisi",
        description: `Mohon isi: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate generation - in real implementation, this would call an AI API
    await new Promise(resolve => setTimeout(resolve, 2500));

    const topik = fieldValues['topik'] || fieldValues['headline'] || fieldValues['produk'] || fieldValues['judul'] || 'Konten';
    const toneLabel = { formal: 'formal', 'semi-formal': 'semi-formal', santai: 'santai', genz: 'Gen Z', corporate: 'corporate', jurnalistik: 'jurnalistik' }[tone];
    
    // Generate mock Indonesian content based on template
    let mainScript = '';
    
    if (selectedTemplate === 'tiktok-60s' || selectedTemplate === 'reels-30s') {
      mainScript = `🎬 HOOK (0-3 detik)
"${topik}? Ini yang jarang orang tau..."

📍 CONTEXT (3-10 detik)
Kenapa ini penting? Karena banyak yang salah paham tentang ${topik}. Padahal kalau kamu paham konsep dasarnya, semuanya jadi lebih gampang.

📝 ISI UTAMA

Poin 1 (10-25 detik):
Pertama, ${topik} itu sebenarnya nggak serumit yang dibayangkan. Kuncinya ada di pemahaman dasar yang benar.

Poin 2 (25-35 detik):
Kedua, kesalahan paling umum adalah terburu-buru tanpa fondasi. Padahal kalau fondasinya kuat, hasilnya pasti maksimal.

Poin 3 (35-45 detik):
Ketiga, konsistensi lebih penting dari intensitas. Lebih baik sedikit tapi rutin, daripada banyak tapi sekali doang.

💡 ANALOGI (45-55 detik)
Ibaratnya kayak nanem pohon—nggak bisa langsung panen, butuh proses. Tapi kalau rajin disiram dan dirawat, hasilnya pasti manis.

🎯 CLOSING + CTA (55-60 detik)
Nah, itu dia 3 hal penting tentang ${topik}. Save video ini biar nggak lupa, dan follow buat tips lainnya!`;
    } else if (selectedTemplate === 'jurnalistik-90s') {
      mainScript = `📰 LEAD
${fieldValues['headline'] || topik} menjadi perhatian publik hari ini, dengan dampak yang dirasakan oleh berbagai pihak.

📋 FAKTA KUNCI
• Peristiwa ini terjadi dan mempengaruhi banyak orang di berbagai wilayah
• Pihak terkait telah memberikan respons resmi terkait situasi ini
• Langkah-langkah penanganan sedang dalam proses pelaksanaan

⚡ DAMPAK & IMPLIKASI
• Dampak jangka pendek terasa pada aktivitas sehari-hari masyarakat
• Implikasi jangka panjang masih dalam pengkajian oleh para ahli

🔮 APA BERIKUTNYA
Pantau terus perkembangan berita ini melalui kanal resmi untuk informasi terbaru dan terpercaya.

💬 CTA
Simpan dan bagikan informasi ini kepada yang membutuhkan.`;
    } else if (selectedTemplate === 'umkm-soft-sell') {
      mainScript = `🎯 HOOK PROBLEM
"${fieldValues['masalah'] || 'Sering merasa kesulitan dengan masalah sehari-hari'}?"

💡 SOLUSI
Kenalan sama ${fieldValues['produk'] || 'produk kami'}—solusi yang udah dipercaya banyak orang!

✨ BENEFIT
• ${(fieldValues['benefit'] as string[])?.[0] || 'Praktis dan mudah digunakan'}
• ${(fieldValues['benefit'] as string[])?.[1] || 'Hasil nyata dalam waktu singkat'}
• ${(fieldValues['benefit'] as string[])?.[2] || 'Harga terjangkau, kualitas premium'}

⭐ BUKTI SOSIAL
${fieldValues['bukti-sosial'] || 'Sudah dipercaya 1000+ pelanggan dengan rating 4.9/5'}

🛒 CTA
${fieldValues['promo'] || 'Ketik "MAU" di DM untuk katalog lengkap + promo spesial hari ini!'}`;
    } else if (selectedTemplate === 'carousel-ig') {
      const poinUtama = (fieldValues['poin-utama'] as string[]) || ['Poin 1', 'Poin 2', 'Poin 3', 'Poin 4', 'Poin 5'];
      mainScript = `📱 CAROUSEL INSTAGRAM - ${topik}

SLIDE 1: COVER
"${topik}"
Hook: "Ini yang wajib kamu tau di 2024!"

SLIDE 2: MASALAH
"Masalahnya..."
Banyak yang masih bingung tentang ${topik}. Padahal ini penting banget untuk [tujuan].

SLIDE 3: POIN 1
"${poinUtama[0] || 'Poin pertama'}"
Penjelasan detail tentang poin ini dengan contoh konkret.

SLIDE 4: POIN 2
"${poinUtama[1] || 'Poin kedua'}"
Breakdown yang mudah dipahami dengan visual pendukung.

SLIDE 5: POIN 3
"${poinUtama[2] || 'Poin ketiga'}"
Tips praktis yang bisa langsung diterapkan.

SLIDE 6: POIN 4
"${poinUtama[3] || 'Poin keempat'}"
Insight tambahan yang sering terlewat.

SLIDE 7: CTA
"Kesimpulan + Action"
${fieldValues['cta'] || 'Save dan share ke teman yang butuh info ini! Follow untuk tips lainnya.'}`;
    } else if (selectedTemplate === 'youtube-3m') {
      const outline = (fieldValues['outline'] as string[]) || ['Bagian 1', 'Bagian 2', 'Bagian 3'];
      mainScript = `🎥 SCRIPT YOUTUBE - ${topik}
Durasi: 3-5 menit

═══════════════════════════════════════

🎬 INTRO (0:00 - 0:15)
"Halo semuanya! Di video kali ini, kita bakal bahas tuntas tentang ${topik}. Kalau kamu penasaran dan pengen tau lebih dalam, tonton sampai habis ya!"

═══════════════════════════════════════

📍 BAGIAN 1: ${outline[0] || 'Pengenalan'} (0:15 - 1:15)
[Opening statement untuk bagian ini]

Mari kita mulai dengan memahami dasar-dasarnya dulu. ${outline[0]} ini penting karena menjadi fondasi dari semua yang akan kita pelajari.

[Poin-poin utama]
• Penjelasan konsep dasar
• Mengapa ini relevan untuk kamu
• Contoh praktis di kehidupan sehari-hari

═══════════════════════════════════════

📍 BAGIAN 2: ${outline[1] || 'Pembahasan Utama'} (1:15 - 2:45)
[Transisi yang smooth]

Nah, sekarang kita masuk ke bagian yang paling penting. Di sini kita akan breakdown ${outline[1]} secara detail.

[Deep dive content]
• Analisis mendalam
• Studi kasus: ${fieldValues['contoh-kasus'] || 'Contoh nyata yang relate'}
• Tips dan trik dari pengalaman

═══════════════════════════════════════

📍 BAGIAN 3: ${outline[2] || 'Kesimpulan'} (2:45 - 3:45)
[Menuju penutup]

Sebelum kita tutup, ada satu hal lagi yang nggak kalah penting tentang ${outline[2]}.

[Final insights]
• Action items yang bisa langsung diterapkan
• Kesalahan yang harus dihindari
• Next steps untuk belajar lebih lanjut

═══════════════════════════════════════

🎯 RECAP + CTA (3:45 - 4:00)
"Oke, jadi itu dia pembahasan lengkap tentang ${topik}. Recap singkatnya: [ringkasan 3 poin]. Kalau video ini bermanfaat, jangan lupa like, subscribe, dan aktifin loncengnya. ${fieldValues['cta'] || 'Sampai jumpa di video berikutnya!'}

═══════════════════════════════════════`;
    } else if (selectedTemplate === 'voiceover-dokumenter') {
      mainScript = `🎙️ VOICE OVER DOKUMENTER - ${topik}

═══════════════════════════════════════

🌅 OPENING (Atmosferik)
[Ambience: suara alam/kota yang relevan]

Di balik kesibukan hari-hari yang berlalu, ada cerita yang jarang terungkap. Cerita tentang ${topik}—yang mungkin selama ini luput dari perhatian kita.

═══════════════════════════════════════

📖 KONTEKS (Latar Belakang)
${fieldValues['setting'] || '[Deskripsi setting dan latar belakang]'}

Perjalanan ini bermula dari sebuah pertanyaan sederhana. Namun jawaban yang ditemukan, ternyata jauh lebih dalam dari yang dibayangkan.

═══════════════════════════════════════

🎭 ISI NARASI
${((fieldValues['narasi-utama'] as string[]) || ['Poin narasi 1', 'Poin narasi 2']).map((poin, i) => `
[Scene ${i + 1}]
${poin}
`).join('\n')}

Setiap langkah membawa pemahaman baru. Setiap sudut pandang menyingkap lapisan yang sebelumnya tersembunyi.

═══════════════════════════════════════

⭐ KLIMAKS / INSIGHT
[Musik memuncak]

Dan di sinilah kebenaran terungkap—bahwa ${topik} bukan sekadar [aspek permukaan], melainkan refleksi dari perjalanan manusia itu sendiri.

═══════════════════════════════════════

🌙 CLOSING (Reflektif)
[Musik memudar, kembali ke ambience]

Mungkin cerita ini tidak berakhir di sini. Mungkin ini baru permulaan dari pemahaman yang lebih dalam. Yang pasti, setiap cerita layak untuk didengar—termasuk yang satu ini.

[Fade out]`;
    } else if (selectedTemplate === 'presentasi') {
      const poinUtama = (fieldValues['poin-utama'] as string[]) || ['Poin 1', 'Poin 2', 'Poin 3'];
      mainScript = `📊 SCRIPT PRESENTASI - ${fieldValues['judul'] || topik}
Durasi: 10-15 menit
Audiens: ${fieldValues['audiens'] || 'Umum'}

═══════════════════════════════════════

📌 SLIDE 1: PEMBUKA
[Judul + Ice Breaker]

"Selamat [pagi/siang/sore], terima kasih sudah hadir di presentasi hari ini."

"Sebelum mulai, ada pertanyaan singkat: [pertanyaan interaktif yang relevan dengan topik]?"

"Nah, itulah yang akan kita bahas hari ini—${fieldValues['judul'] || topik}."

═══════════════════════════════════════

📌 SLIDE 2: AGENDA
[Outline Presentasi]

"Dalam presentasi ini, kita akan membahas:"

1. ${poinUtama[0] || 'Pembahasan pertama'}
2. ${poinUtama[1] || 'Pembahasan kedua'}
3. ${poinUtama[2] || 'Pembahasan ketiga'}
4. Diskusi & Tanya Jawab

"Tujuan kita hari ini: ${fieldValues['tujuan'] || 'Memahami topik secara komprehensif'}"

═══════════════════════════════════════

📌 SLIDE 3-5: ISI UTAMA

[Slide 3: ${poinUtama[0]}]
• Penjelasan konsep
• Data pendukung
• Contoh konkret

[Slide 4: ${poinUtama[1]}]
• Analisis mendalam
• Studi kasus
• Best practices

[Slide 5: ${poinUtama[2]}]
• Implementasi praktis
• Tips & trik
• Common pitfalls

═══════════════════════════════════════

📌 SLIDE 6: PENUTUP
[Ringkasan + Q&A]

"Jadi, key takeaways dari presentasi hari ini:"

✓ [Poin ringkasan 1]
✓ [Poin ringkasan 2]  
✓ [Poin ringkasan 3]

"Ada pertanyaan atau diskusi?"

"Terima kasih atas perhatiannya!"`;
    } else {
      mainScript = `📝 KONTEN: ${topik}

Gaya: ${toneLabel}
Format: ${outputFormat}

${topik} adalah topik yang menarik untuk dibahas. Dalam konten ini, kita akan mengeksplorasi berbagai aspek penting yang perlu dipahami.

Poin-poin utama:
• Aspek pertama yang perlu diperhatikan
• Aspek kedua yang tidak kalah penting
• Aspek ketiga sebagai pelengkap

Dengan memahami ketiga aspek tersebut, diharapkan audience dapat memiliki pemahaman yang lebih komprehensif tentang ${topik}.`;
    }

    // Generate additional content based on production options
    const content: GeneratedContent = {
      id: generateId(),
      templateId: selectedTemplate,
      content: {
        mainScript,
        caption: productionOptions.includeCaption ? `${topik} 🎯\n\nSiapa yang butuh info ini? Tag temanmu! 👇\n\n#${(topik as string).replace(/\s+/g, '')} #KontenIndonesia #Tips2024` : undefined,
        hashtags: productionOptions.includeHashtags ? [
          `#${(topik as string).replace(/\s+/g, '')}`,
          '#KontenIndonesia',
          '#Tips',
          '#Edukasi',
          '#Viral2024',
          '#FYP',
          '#Trending',
        ] : undefined,
        onScreenText: productionOptions.includeOnScreenText ? [
          `${topik}`,
          'Ini yang jarang orang tau...',
          'Poin 1: [Keyword utama]',
          'Poin 2: [Keyword kedua]',
          'Poin 3: [Keyword ketiga]',
          'Save & Share! 💾',
        ] : undefined,
        shotList: productionOptions.includeShotList ? [
          'Opening: Close-up wajah talent dengan ekspresi curious',
          'B-roll: Stock footage relevan dengan topik',
          'Main content: Medium shot talent menjelaskan',
          'Transition: Zoom in/out effect',
          'Closing: Wide shot dengan text overlay CTA',
        ] : undefined,
        subtitleFriendly: productionOptions.includeSubtitleFriendly ? `${topik}?
Ini yang jarang orang tau.
Pertama.
[Poin 1 singkat]
Kedua.
[Poin 2 singkat]
Ketiga.
[Poin 3 singkat]
Save video ini.
Follow untuk tips lainnya!` : undefined,
      },
      metadata: {
        duration,
        wordCount: durationToWords(duration),
        tone,
        format: outputFormat,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      title: `${currentTemplate.name} - ${topik}`,
      isDraft: false,
    };

    setGeneratedContent(content);
    setIsLoading(false);
    
    toast({
      title: "Konten berhasil digenerate!",
      description: "Script dalam Bahasa Indonesia telah dibuat sesuai template",
    });
  };

  const handleSaveDraft = () => {
    if (!generatedContent) return;
    
    const draft: DraftHistory = {
      id: generateId(),
      title: generatedContent.title,
      templateId: selectedTemplate,
      content: generatedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setDrafts(prev => [draft, ...prev]);
    toast({
      title: "Draft tersimpan!",
      description: "Kamu bisa akses draft ini nanti dari panel Riwayat",
    });
  };

  const handleLoadDraft = (draft: DraftHistory) => {
    setSelectedTemplate(draft.templateId);
    setGeneratedContent(draft.content);
    toast({
      title: "Draft dimuat",
      description: draft.title,
    });
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Draft dihapus",
    });
  };

  const handleDuplicateDraft = (draft: DraftHistory) => {
    const newDraft: DraftHistory = {
      ...draft,
      id: generateId(),
      title: `${draft.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDrafts(prev => [newDraft, ...prev]);
    toast({
      title: "Draft diduplikasi",
      description: newDraft.title,
    });
  };

  const handleRenameDraft = (id: string, newTitle: string) => {
    setDrafts(prev => prev.map(d => 
      d.id === id ? { ...d, title: newTitle, updatedAt: new Date() } : d
    ));
  };

  const handleReset = () => {
    setFieldValues({});
    setGeneratedContent(null);
  };

  return (
    <MainLayout>
      <PageHeader
        icon={FileText}
        title="Text Generator"
        description="Buat script, artikel, dan konten kreatif dalam Bahasa Indonesia"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,450px]">
        {/* Left Column - Main Input & Output */}
        <div className="space-y-6">
          {/* Input Section */}
          <div className="glass-card rounded-xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="space-y-6">
              {/* Template Selector */}
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleTemplateChange}
              />

              {/* Tone & Duration Row */}
              <div className="grid gap-6 md:grid-cols-2">
                <ToneSelector selectedTone={tone} onSelectTone={setTone} />
                <DurationControl 
                  duration={duration} 
                  onDurationChange={setDuration}
                  minDuration={15}
                  maxDuration={300}
                />
              </div>

              {/* Output Format */}
              <OutputFormatSelector
                selectedFormat={outputFormat}
                onSelectFormat={setOutputFormat}
              />

              {/* Template-specific Fields */}
              <div className="border-t border-border pt-6">
                <TemplateFields
                  fields={currentTemplate.fields}
                  values={fieldValues}
                  onChange={handleFieldChange}
                />
              </div>

              {/* Structure Preview */}
              <StructurePreview template={currentTemplate} />

              {/* Brand Voice Panel */}
              <BrandVoicePanel
                brandVoice={brandVoice}
                onBrandVoiceChange={setBrandVoice}
              />

              {/* Production Options */}
              <ProductionOptions
                options={productionOptions}
                onChange={setProductionOptions}
              />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <GenerateButton
                  onClick={handleGenerate}
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Generate Konten
                </GenerateButton>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                {generatedContent && (
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Simpan
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <OutputSection content={generatedContent} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Column - History */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="sticky top-6">
            <HistoryPanel
              drafts={drafts}
              onLoadDraft={handleLoadDraft}
              onDeleteDraft={handleDeleteDraft}
              onDuplicateDraft={handleDuplicateDraft}
              onRenameDraft={handleRenameDraft}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TextGenerator;
