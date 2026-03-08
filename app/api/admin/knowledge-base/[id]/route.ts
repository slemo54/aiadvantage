import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySessionCookie } from "@/lib/auth";
import { clearPromptCache } from "@/lib/ai/prompt-resolver";
import type { PipelineStage } from "@/lib/constants";

export const dynamic = "force-dynamic";

const BUCKET_NAME = "knowledge-base";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionCookie = request.cookies.get("admin_session");
  if (!(await verifySessionCookie(sessionCookie?.value, process.env.ADMIN_PASSWORD))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Get file info for storage path and stage
  const { data: file, error: fetchErr } = await supabase
    .from("knowledge_base_files")
    .select("storage_path, stage")
    .eq("id", id)
    .single();

  if (fetchErr || !file) {
    return NextResponse.json({ error: "File non trovato" }, { status: 404 });
  }

  // Delete from storage
  await supabase.storage.from(BUCKET_NAME).remove([file.storage_path]);

  // Delete from database
  const { error: deleteErr } = await supabase
    .from("knowledge_base_files")
    .delete()
    .eq("id", id);

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  clearPromptCache(file.stage as PipelineStage);

  return NextResponse.json({ success: true });
}
