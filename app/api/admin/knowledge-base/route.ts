import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySessionCookie } from "@/lib/auth";
import { PIPELINE_STAGES } from "@/lib/constants";
import type { PipelineStage } from "@/lib/constants";
import { clearPromptCache } from "@/lib/ai/prompt-resolver";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = "knowledge-base";

function isValidStage(s: unknown): s is PipelineStage {
  return typeof s === "string" && (PIPELINE_STAGES as readonly string[]).includes(s);
}

async function authorize(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get("admin_session");
  return verifySessionCookie(sessionCookie?.value, process.env.ADMIN_PASSWORD);
}

// GET — list files for a stage
export async function GET(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const stage = request.nextUrl.searchParams.get("stage");
  const supabase = createAdminClient();

  let query = supabase
    .from("knowledge_base_files")
    .select("*")
    .order("created_at", { ascending: false });

  if (stage && isValidStage(stage)) {
    query = query.eq("stage", stage);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ files: data });
}

// POST — upload a .md file
export async function POST(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const formData = await request.formData();
  const stage = formData.get("stage") as string | null;
  const file = formData.get("file") as File | null;

  if (!isValidStage(stage)) {
    return NextResponse.json({ error: "Stage non valido" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "File richiesto" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File troppo grande (max 5MB)" }, { status: 400 });
  }

  // Only .md files in v1
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext !== "md") {
    return NextResponse.json(
      { error: "Formato non supportato. Solo file .md in questa versione." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Read file content as text (markdown)
  const textContent = await file.text();

  // Upload to Supabase Storage
  const storagePath = `${stage}/${crypto.randomUUID()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, { contentType: file.type || "text/markdown" });

  if (uploadError) {
    return NextResponse.json(
      { error: `Errore upload: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Save metadata with extracted text
  const { data: kbFile, error: insertError } = await supabase
    .from("knowledge_base_files")
    .insert({
      stage,
      file_name: file.name,
      file_type: "md",
      storage_path: storagePath,
      extracted_text: textContent.slice(0, 50000), // Cap at 50k chars
      file_size_bytes: file.size,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  clearPromptCache(stage);

  return NextResponse.json({ success: true, file: kbFile });
}
