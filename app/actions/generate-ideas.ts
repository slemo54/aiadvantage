"use server";

import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/auth";
import { researchTopic } from "@/lib/ai/perplexity";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CategoryKey } from "@/lib/constants";

const VALID_CATEGORIES: CategoryKey[] = [
  "casi_duso",
  "ai_news",
  "web_dev",
  "tools",
  "tutorial",
  "opinioni",
];

function sanitizeCategory(raw: string): CategoryKey {
  const normalized = raw.toLowerCase().trim() as CategoryKey;
  return VALID_CATEGORIES.includes(normalized) ? normalized : "ai_news";
}

export async function generateIdeasAction(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false, error: "ADMIN_PASSWORD non configurata." };
  }

  const isValid = await verifySessionCookie(sessionCookie?.value, adminPassword);
  if (!isValid) {
    return { success: false, error: "Non autorizzato. Effettua il login." };
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    return { success: false, error: "PERPLEXITY_API_KEY non configurata." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { success: false, error: "Supabase non configurato." };
  }

  try {
    console.log("[generateIdeasAction] Avvio ricerca topic con Perplexity...");
    const research = await researchTopic("");
    const supabase = createAdminClient();

    const ideasToInsert = research.raw_topics.map((topic) => ({
      topic: topic.titolo,
      source_url: topic.fonti?.[0] ?? null,
      freshness_score: topic.freshness_score ?? 50,
      status: "new" as const,
      category: sanitizeCategory(topic.categoria),
      perplexity_research: {
        descrizione: topic.descrizione,
        fonti: topic.fonti,
        summary: research.summary,
      },
    }));

    const { data: inserted, error } = await supabase
      .from("ideas")
      .insert(ideasToInsert)
      .select("id, topic, category, freshness_score");

    if (error) throw new Error(`Supabase insert error: ${error.message}`);

    return {
      success: true,
      message: `${inserted?.length ?? 0} idee create con successo`,
    };
  } catch (err) {
    console.error("[generateIdeasAction] Errore:", err);
    return { success: false, error: String(err) };
  }
}
