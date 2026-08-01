import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  assignmentTitle: z.string().trim().min(2).max(160),
  subject: z.string().trim().min(1).max(120),
  className: z.string().trim().max(60).optional().default(""),
  schoolName: z.string().trim().max(160).optional().default(""),
  stylePreference: z.string().trim().max(400).optional().default(""),
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

        try {
          const { generateCoverArtwork } = await import("@/lib/ai-cover.server");
          const result = await generateCoverArtwork(parsed.data);
          return Response.json(result, {
            headers: { "Cache-Control": "no-store" },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unexpected error";
          console.error("[api/ai-cover-image]", message);
          return Response.json(
            { error: message.slice(0, 300) },
            { status: /unavailable|Upstream 5|timed out|abort/i.test(message) ? 503 : 502 },
          );
        }
      },
    },
  },
});