import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySessionCookie } from "@/lib/auth";
import { PIPELINE_STAGES } from "@/lib/constants";
import type { PipelineStage } from "@/lib/constants";
import { interpolatePrompt, appendKnowledgeBase } from "@/lib/ai/prompt-resolver";

export const dynamic = "force-dynamic";

function isValidStage(s: unknown): s is PipelineStage {
  return typeof s === "string" && (PIPELINE_STAGES as readonly string[]).includes(s);
}

// Call the real AI model for the given stage
async function callStageAI(
  stage: PipelineStage,
  assembledPrompt: string
): Promise<{ output: string; model: string }> {
  switch (stage) {
    case "research": {
      const apiKey = process.env.PERPLEXITY_API_KEY;
      if (!apiKey) throw new Error("PERPLEXITY_API_KEY non configurata");
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [{ role: "user", content: assembledPrompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });
      if (!res.ok) throw new Error(`Perplexity HTTP ${res.status}`);
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      return { output: data.choices[0]?.message?.content ?? "", model: "sonar-pro" };
    }

    case "draft":
    case "seo": {
      const apiKey = process.env.VENICE_API_KEY;
      if (!apiKey) throw new Error("VENICE_API_KEY non configurata");
      const res = await fetch("https://api.venice.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "venice-uncensored",
          messages: [{ role: "user", content: assembledPrompt }],
          temperature: 0.75,
          max_tokens: 4000,
        }),
      });
      if (!res.ok) throw new Error(`Venice HTTP ${res.status}`);
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      return { output: data.choices[0]?.message?.content ?? "", model: "venice-uncensored" };
    }

    case "humanize": {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY non configurata");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          messages: [{ role: "user", content: assembledPrompt }],
        }),
      });
      if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}`);
      const data = (await res.json()) as { content: { type: string; text?: string }[] };
      const text = data.content.find((b) => b.type === "text")?.text ?? "";
      return { output: text, model: "claude-sonnet-4-6" };
    }

    case "images": {
      const apiKey = process.env.VENICE_API_KEY;
      if (!apiKey) throw new Error("VENICE_API_KEY non configurata");
      const res = await fetch("https://api.venice.ai/api/v1/images/generations", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "fluently-xl",
          prompt: assembledPrompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
        }),
      });
      if (!res.ok) throw new Error(`Venice Image HTTP ${res.status}`);
      const data = (await res.json()) as { data: { b64_json?: string }[] };
      const b64 = data.data?.[0]?.b64_json;
      return {
        output: b64 ? `data:image/png;base64,${b64}` : "Nessuna immagine generata",
        model: "fluently-xl",
      };
    }

    default:
      throw new Error(`Stage sconosciuto: ${stage}`);
  }
}

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  if (!(await verifySessionCookie(sessionCookie?.value, process.env.ADMIN_PASSWORD))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const { stage, prompt_text, sample_input } = body;

  if (!isValidStage(stage)) {
    return NextResponse.json({ error: "Stage non valido" }, { status: 400 });
  }
  if (typeof prompt_text !== "string" || !prompt_text.trim()) {
    return NextResponse.json({ error: "prompt_text richiesto" }, { status: 400 });
  }
  if (typeof sample_input !== "string" || !sample_input.trim()) {
    return NextResponse.json({ error: "sample_input richiesto" }, { status: 400 });
  }

  try {
    // Build variable map based on stage
    const varMap: Record<string, string> = {};
    switch (stage) {
      case "research":
        varMap.topic = sample_input;
        break;
      case "draft":
        varMap.research = sample_input;
        varMap.category = "ai_news";
        break;
      case "humanize":
        varMap.draft = sample_input;
        break;
      case "images":
        varMap.title = sample_input;
        varMap.category = "ai_news";
        break;
      case "seo":
        varMap.title = sample_input.split("\n")[0] ?? sample_input;
        varMap.content = sample_input;
        break;
    }

    // Interpolate template
    let assembledPrompt = interpolatePrompt(prompt_text, varMap);

    // Fetch and append knowledge base context
    const supabase = createAdminClient();
    const { data: kbFiles } = await supabase
      .from("knowledge_base_files")
      .select("file_name, extracted_text")
      .eq("stage", stage);

    const knowledgeContext = (kbFiles ?? [])
      .filter((f): f is typeof f & { extracted_text: string } => Boolean(f.extracted_text))
      .map((f) => `--- ${f.file_name} ---\n${f.extracted_text}`)
      .join("\n\n");

    assembledPrompt = appendKnowledgeBase(assembledPrompt, knowledgeContext);

    const startTime = Date.now();
    const { output, model } = await callStageAI(stage, assembledPrompt);
    const duration_ms = Date.now() - startTime;

    return NextResponse.json({ output, model, duration_ms });
  } catch (err) {
    console.error("[verify] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
