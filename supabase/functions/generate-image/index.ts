import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageRequest {
  prompt: string;
  style: string;
  aspectRatio: string;
}

const stylePrompts: Record<string, string> = {
  'realistic': 'photorealistic, ultra high resolution, professional photography, sharp focus, natural lighting',
  'anime': 'anime style, manga art, Japanese animation, vibrant colors, detailed linework',
  'digital-art': 'digital art, digital painting, concept art, detailed illustration, vibrant',
  'oil-painting': 'oil painting style, classical art, brush strokes visible, rich textures, fine art',
  'watercolor': 'watercolor painting, soft edges, flowing colors, artistic, delicate washes',
  '3d-render': '3D render, CGI, photorealistic 3D, octane render, high detail, studio lighting',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, aspectRatio }: ImageRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!prompt || prompt.trim() === '') {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating image with prompt:", prompt);
    console.log("Style:", style);
    console.log("Aspect ratio:", aspectRatio);

    // Build enhanced prompt with style
    const styleEnhancement = stylePrompts[style] || stylePrompts['realistic'];
    const aspectDescription = aspectRatio === '16:9' ? 'landscape wide format' : 
                              aspectRatio === '9:16' ? 'portrait tall format' :
                              aspectRatio === '4:3' ? 'standard format' : 'square format';
    
    const enhancedPrompt = `${prompt}. Style: ${styleEnhancement}. ${aspectDescription}. Ultra high resolution.`;

    console.log("Enhanced prompt:", enhancedPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a few minutes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    // Extract image from response
    const images = aiResponse.choices?.[0]?.message?.images;
    
    if (!images || images.length === 0) {
      console.error("No images in response:", JSON.stringify(aiResponse));
      throw new Error("No image generated");
    }

    const imageUrl = images[0]?.image_url?.url;
    
    if (!imageUrl) {
      throw new Error("Invalid image URL in response");
    }

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ 
        imageUrl,
        prompt: enhancedPrompt 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
