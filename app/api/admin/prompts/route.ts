import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySessionCookie } from "@/lib/auth";
import { PIPELINE_STAGES } from "@/lib/constants";
import type { PipelineStage } from "@/lib/constants";
import { clearPromptCache } from "@/lib/ai/prompt-resolver";

export const dynamic = "force-dynamic";

function isValidStage(s: unknown): s is PipelineStage {
  return typeof s === "string" && (PIPELINE_STAGES as readonly string[]).includes(s);
}

async function authorize(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get("admin_session");
  return verifySessionCookie(sessionCookie?.value, process.env.ADMIN_PASSWORD);
}

// GET — fetch active prompts (optionally filter by ?stage=X)
export async function GET(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const stage = request.nextUrl.searchParams.get("stage");

  let query = supabase
    .from("prompt_configs")
    .select("*")
    .eq("is_active", true)
    .order("stage");

  if (stage && isValidStage(stage)) {
    query = query.eq("stage", stage);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ prompts: data });
}

// POST — save a new prompt version for a stage
export async function POST(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const { stage, prompt_text } = body;

  if (!isValidStage(stage)) {
    return NextResponse.json({ error: "Stage non valido" }, { status: 400 });
  }
  if (typeof prompt_text !== "string" || !prompt_text.trim()) {
    return NextResponse.json({ error: "prompt_text richiesto" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get current max version for this stage
  const { data: versions } = await supabase
    .from("prompt_configs")
    .select("version")
    .eq("stage", stage)
    .order("version", { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version ?? 0) + 1;

  // Deactivate current active prompt
  await supabase
    .from("prompt_configs")
    .update({ is_active: false })
    .eq("stage", stage)
    .eq("is_active", true);

  // Insert new version
  const { data: newPrompt, error } = await supabase
    .from("prompt_configs")
    .insert({
      stage,
      prompt_text: prompt_text.trim(),
      version: nextVersion,
      is_active: true,
      created_by: "admin",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  clearPromptCache(stage);

  return NextResponse.json({ success: true, prompt: newPrompt });
}
