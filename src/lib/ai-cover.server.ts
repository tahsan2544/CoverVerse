// Server-only helpers for AI cover-image generation.
// Keys are read from process.env inside these functions (never at module scope).

export type CoverBrief = {
  assignmentTitle: string;
  subject: string;
  className?: string;
  schoolName?: string;
  stylePreference?: string;
};

export type CoverImageResult = {
  imagePrompt: string;
  imageDataUrl: string;
  provider: "flux-schnell" | "lovable-ai";
  negativePrompt?: string;
  palette?: string[];
  mood?: string;
};

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  { retries = 2, timeoutMs = 60_000 }: { retries?: number; timeoutMs?: number } = {},
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      // Retry only on transient failures.
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`Upstream ${res.status}: ${(await res.text()).slice(0, 300)}`);
      } else {
        return res;
      }
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) await new Promise((r) => setTimeout(r, 700 * 2 ** attempt));
  }
  throw lastError instanceof Error ? lastError : new Error("Upstream request failed");
}

const SYSTEM_PROMPT = [
  "You write prompts for an image model that generates ABSTRACT BACKGROUND ARTWORK for academic assignment cover pages.",
  "The artwork must contain NO text, NO letters, NO numbers, NO logos and NO people.",
  "Leave the vertical center visually calm so title text can be overlaid on top.",
  "Respond with JSON only:",
  '{"imagePrompt": string, "negativePrompt": string, "palette": string[], "mood": string}',
  "imagePrompt must be one vivid paragraph under 600 characters describing subject-appropriate abstract motifs, composition, colors and lighting.",
].join(" ");

function extractJson(raw: string): Record<string, unknown> {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw new Error("Model did not return valid JSON");
  }
}

export async function generateImagePrompt(brief: CoverBrief) {
  const key = process.env['OPENROUTER_API_KEY'];
  if (!key) throw new Error("Missing OPENROUTER_API_KEY");

  const userMessage = [
    `Assignment title: ${brief.assignmentTitle}`,
    `Subject: ${brief.subject}`,
    `Class / level: ${brief.className || "(unspecified)"}`,
    `School: ${brief.schoolName || "(unspecified)"}`,
    `Requested style / vibe: ${brief.stylePreference || "(none — choose what fits best)"}`,
  ].join("\n");

  const res = await fetchWithRetry(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-235b-a22b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        reasoning: { enabled: false },
      }),
    },
    { retries: 2, timeoutMs: 90_000 },
  );

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 400);
    throw new Error(`Prompt model rejected the request (${res.status}): ${detail}`);
  }

  const payload = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Prompt model returned an empty response");

  const parsed = extractJson(content);
  const imagePrompt = typeof parsed['imagePrompt'] === "string" ? parsed['imagePrompt'].trim() : "";
  if (!imagePrompt) throw new Error("Prompt model response had no imagePrompt");

  return {
    imagePrompt: imagePrompt.slice(0, 900),
    negativePrompt:
      typeof parsed['negativePrompt'] === "string" ? parsed['negativePrompt'].slice(0, 400) : undefined,
    palette: Array.isArray(parsed['palette'])
      ? (parsed['palette'] as unknown[]).filter((c): c is string => typeof c === "string").slice(0, 6)
      : undefined,
    mood: typeof parsed['mood'] === "string" ? parsed['mood'].slice(0, 120) : undefined,
  };
}

const NO_TEXT_SUFFIX =
  " Abstract background artwork only. No text, no letters, no numbers, no watermarks, no people. Vertical A4 poster composition with calm central area.";

async function generateWithFlux(prompt: string): Promise<string | null> {
  const falKey = process.env['FAL_KEY'];
  if (!falKey) return null;

  const res = await fetchWithRetry(
    "https://fal.run/fal-ai/flux/schnell",
    {
      method: "POST",
      headers: { Authorization: `Key ${falKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt + NO_TEXT_SUFFIX,
        image_size: { width: 768, height: 1088 },
        num_images: 1,
        num_inference_steps: 4,
        enable_safety_checker: true,
      }),
    },
    { retries: 1, timeoutMs: 90_000 },
  );

  if (!res.ok) {
    console.error(`[ai-cover] FLUX.1 Schnell failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    return null;
  }

  const payload = (await res.json()) as { images?: Array<{ url?: string }> };
  const url = payload.images?.[0]?.url;
  if (!url) return null;

  // Inline the bytes so the cover renders and exports offline without CORS issues.
  if (url.startsWith("data:")) return url;
  const imgRes = await fetchWithRetry(url, { method: "GET" }, { retries: 1, timeoutMs: 60_000 });
  if (!imgRes.ok) return null;
  const buf = new Uint8Array(await imgRes.arrayBuffer());
  const type = imgRes.headers.get("content-type") || "image/jpeg";
  return `data:${type};base64,${toBase64(buf)}`;
}

async function generateWithLovableAi(prompt: string): Promise<string | null> {
  const key = process.env['LOVABLE_API_KEY'];
  if (!key) return null;

  const res = await fetchWithRetry(
    "https://ai.gateway.lovable.dev/v1/images/generations",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image",
        messages: [{ role: "user", content: prompt + NO_TEXT_SUFFIX }],
        modalities: ["image", "text"],
        stream: false,
      }),
    },
    { retries: 1, timeoutMs: 120_000 },
  );

  if (!res.ok) {
    console.error(`[ai-cover] Lovable AI image failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    return null;
  }

  const payload = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const item = payload.data?.[0];
  if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
  if (item?.url?.startsWith("data:")) return item.url;
  return null;
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function generateCoverArtwork(brief: CoverBrief): Promise<CoverImageResult> {
  const { imagePrompt, negativePrompt, palette, mood } = await generateImagePrompt(brief);

  const flux = await generateWithFlux(imagePrompt);
  if (flux) {
    return { imagePrompt, imageDataUrl: flux, provider: "flux-schnell", negativePrompt, palette, mood };
  }

  const fallback = await generateWithLovableAi(imagePrompt);
  if (fallback) {
    return { imagePrompt, imageDataUrl: fallback, provider: "lovable-ai", negativePrompt, palette, mood };
  }

  throw new Error("Image generation is unavailable right now. Please try again in a moment.");
}