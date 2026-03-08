import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySessionCookie } from "@/lib/auth";
import { PIPELINE_STAGES } from "@/lib/constants";
import type { PipelineStage } from "@/lib/constants";

export const dynamic = "force-dynamic";

function isValidStage(s: unknown): s is PipelineStage {
  return typeof s === "string" && (PIPELINE_STAGES as readonly string[]).includes(s);
}

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  if (!(await verifySessionCookie(sessionCookie?.value, process.env.ADMIN_PASSWORD))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const stage = request.nextUrl.searchParams.get("stage");
  if (!isValidStage(stage)) {
    return NextResponse.json({ error: "Parametro stage richiesto" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("prompt_configs")
    .select("*")
    .eq("stage", stage)
    .order("version", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ history: data });
}
