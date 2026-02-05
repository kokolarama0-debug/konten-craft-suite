import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CaptionRequest {
  platform: string;
  contentType: "text" | "image" | "video";
  contentTitle: string;
  contentPreview: string;
  includeHashtags: boolean;
  tone?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, contentType, contentTitle, contentPreview, includeHashtags, tone }: CaptionRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const platformTips: Record<string, string> = {
      instagram: "Gunakan emoji yang relevan, maksimal 2200 karakter, taruh hashtag di akhir",
      tiktok: "Singkat dan catchy, maksimal 150 karakter, gunakan hashtag trending",
      youtube: "Informatif dan engaging, bisa lebih panjang, sertakan call-to-action",
      facebook: "Conversational, bisa lebih panjang, ajak diskusi",
      twitter: "Sangat singkat, maksimal 280 karakter, to the point",
    };

    const toneDescriptions: Record<string, string> = {
      formal: "formal dan profesional",
      "semi-formal": "sopan tapi santai",
      santai: "bahasa sehari-hari, friendly",
      genz: "gaul, kekinian, pakai slang Gen Z",
      corporate: "bisnis dan meyakinkan",
      jurnalistik: "netral dan informatif",
    };

    const systemPrompt = `Kamu adalah social media content writer Indonesia yang ahli membuat caption viral.

ATURAN:
1. Semua output WAJIB dalam Bahasa Indonesia
2. Sesuaikan dengan platform: ${platformTips[platform] || "Buat caption yang engaging"}
3. Gaya bahasa: ${toneDescriptions[tone || "santai"] || "santai dan friendly"}
4. Buat caption yang mengundang engagement (like, comment, share)
${includeHashtags ? "5. Sertakan 5-10 hashtag relevan di akhir caption" : "5. JANGAN sertakan hashtag"}

FORMAT OUTPUT (JSON):
{
  "caption": "Caption utama yang engaging",
  ${includeHashtags ? '"hashtags": ["hashtag1", "hashtag2", ...]' : ""}
}`;

    const userPrompt = `Buatkan caption untuk ${platform} berdasarkan konten berikut:

Judul: ${contentTitle}
Tipe: ${contentType === "text" ? "Konten teks/script" : contentType === "image" ? "Gambar" : "Video"}
Preview: ${contentPreview}

Buat caption yang menarik dan sesuai platform!`;

    console.log("Generating caption for:", platform, contentType, contentTitle);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit tercapai. Coba lagi dalam beberapa menit." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Kredit habis. Silakan tambah kredit di workspace Anda." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response
    let parsedContent;
    try {
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      parsedContent = JSON.parse(jsonStr);
    } catch {
      // If not valid JSON, extract caption from text
      parsedContent = {
        caption: content.trim(),
        hashtags: [],
      };
    }

    console.log("Caption generated successfully");

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating caption:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
