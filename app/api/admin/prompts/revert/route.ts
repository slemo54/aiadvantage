import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySessionCookie } from "@/lib/auth";
import { clearPromptCache } from "@/lib/ai/prompt-resolver";
import type { PipelineStage } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  if (!(await verifySessionCookie(sessionCookie?.value, process.env.ADMIN_PASSWORD))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const { promptId } = body;

  if (typeof promptId !== "string") {
    return NextResponse.json({ error: "promptId richiesto" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get the prompt to revert to
  const { data: target, error: fetchErr } = await supabase
    .from("prompt_configs")
    .select("*")
    .eq("id", promptId)
    .single();

  if (fetchErr || !target) {
    return NextResponse.json({ error: "Prompt non trovato" }, { status: 404 });
  }

  const stage = target.stage as PipelineStage;

  // Deactivate current active prompt for this stage
  await supabase
    .from("prompt_configs")
    .update({ is_active: false })
    .eq("stage", stage)
    .eq("is_active", true);

  // Reactivate the target prompt
  const { error: updateErr } = await supabase
    .from("prompt_configs")
    .update({ is_active: true })
    .eq("id", promptId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  clearPromptCache(stage);

  return NextResponse.json({ success: true, restored: target });
}
