import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const InputSchema = z.object({
  assignmentTitle: z.string(),
  subject: z.string(),
  className: z.string().optional().default(""),
  schoolName: z.string().optional().default(""),
  stylePreference: z.string().optional().default(""),
  layoutIds: z.array(z.string()),
  paletteIds: z.array(z.string()),
  fontIds: z.array(z.string()),
  categories: z.array(z.string()),
});

const OutputSchema = z.object({
  layoutId: z.string(),
  paletteId: z.string(),
  fontId: z.string(),
  category: z.string(),
  rationale: z.string(),
});

export type AiDesignRecommendation = z.infer<typeof OutputSchema>;

export const recommendCoverDesign = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AiDesignRecommendation> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key, { structuredOutputs: true });
    const model = gateway("openai/gpt-5.5");

    const system = [
      "You are a design assistant for assignment cover pages.",
      "Choose ONE layout, ONE palette, ONE font pair, and ONE category from the provided lists.",
      "Match the subject and title tone: sciences → clean/modern; humanities/literature → elegant/serif; art/design → creative/colorful; primary/school → friendly/colorful; thesis/formal reports → premium/academic/minimal.",
      "Return concise JSON matching the schema. Keep rationale under 240 characters.",
    ].join(" ");

    const prompt = [
      `Assignment title: ${data.assignmentTitle}`,
      `Subject: ${data.subject}`,
      `Class/level: ${data.className}`,
      `School: ${data.schoolName}`,
      `Style preference: ${data.stylePreference || "(none)"}`,
      ``,
      `Allowed layouts: ${data.layoutIds.join(", ")}`,
      `Allowed palettes: ${data.paletteIds.join(", ")}`,
      `Allowed fonts: ${data.fontIds.join(", ")}`,
      `Allowed categories: ${data.categories.join(", ")}`,
    ].join("\n");

    try {
      const { output: out } = await generateText({
        model,
        output: Output.object({ schema: OutputSchema }),
        system,
        prompt,
      });
      const safe = {
        layoutId: data.layoutIds.includes(out.layoutId) ? out.layoutId : data.layoutIds[0],
        paletteId: data.paletteIds.includes(out.paletteId) ? out.paletteId : data.paletteIds[0],
        fontId: data.fontIds.includes(out.fontId) ? out.fontId : data.fontIds[0],
        category: data.categories.includes(out.category) ? out.category : data.categories[0],
        rationale: (out.rationale ?? "").slice(0, 240),
      };
      return safe;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return {
          layoutId: data.layoutIds[0],
          paletteId: data.paletteIds[0],
          fontId: data.fontIds[0],
          category: data.categories[0],
          rationale: "Fallback recommendation — the AI response could not be parsed.",
        };
      }
      throw error;
    }
  });