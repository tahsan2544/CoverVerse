import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  assignmentTitle: z.string().trim().min(2).max(160),
  subject: z.string().trim().min(1).max(120),
  className: z.string().trim().max(60).optional().default(""),
  schoolName: z.string().trim().max(160).optional().default(""),
  stylePreference: z.string().trim().max(400).optional().default(""),
  clientKey: z.string().trim().max(80).optional().default(""),
});

export const Route = createFileRoute("/api/ai-cover-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = BodySchema.safeParse(raw);
        if (!parsed.success) {
          return Response.json(
            { error: "Please fill in the assignment title and subject first." },
            { status: 422 },
          );
        }

        const { checkAiQuota, logAiGeneration } = await import("@/lib/ai-limits.server");
        const gate = await checkAiQuota(request, parsed.data.clientKey);
        if (!gate.allowed) {
          return Response.json({ error: gate.message }, { status: gate.status });
        }

        try {
          const { generateCoverArtwork } = await import("@/lib/ai-cover.server");
          const result = await generateCoverArtwork(parsed.data);
          await logAiGeneration({
            userId: gate.userId,
            clientKey: gate.clientKey,
            prompt: result.imagePrompt,
            provider: result.provider,
            success: true,
          });
          return Response.json({ ...result, remaining: gate.remaining }, {
            headers: { "Cache-Control": "no-store" },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unexpected error";
          console.error("[api/ai-cover-image]", message);
          await logAiGeneration({
            userId: gate.userId,
            clientKey: gate.clientKey,
            success: false,
            error: message,
          });
          return Response.json(
            { error: message.slice(0, 300) },
            { status: /unavailable|Upstream 5|timed out|abort/i.test(message) ? 503 : 502 },
          );
        }
      },
    },
  },
});