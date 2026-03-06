import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  // Delete all non-published articles
  const { data: deletedArticles, error: artError } = await supabase
    .from("articles")
    .delete()
    .neq("status", "published")
    .select("id, title, status");

  if (artError) {
    return NextResponse.json({ error: artError.message }, { status: 500 });
  }

  // Delete all ideas
  const { data: deletedIdeas, error: ideasError } = await supabase
    .from("ideas")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // delete all
    .select("id, topic");

  if (ideasError) {
    return NextResponse.json({ error: ideasError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    deleted_articles: deletedArticles?.length ?? 0,
    deleted_ideas: deletedIdeas?.length ?? 0,
    articles: deletedArticles?.map((a) => `[${a.status}] ${a.title}`),
    ideas: deletedIdeas?.map((i) => i.topic),
  });
}
