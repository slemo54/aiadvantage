// Prompt resolver — loads prompts from DB with fallback to hardcoded defaults

import { createAdminClient } from "@/lib/supabase/admin";
import type { PipelineStage } from "@/lib/constants";

interface ResolvedPrompt {
  promptText: string;
  knowledgeContext: string;
}

// In-memory cache with TTL
const cache = new Map<PipelineStage, { data: ResolvedPrompt; expiry: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

export async function resolvePrompt(stage: PipelineStage): Promise<ResolvedPrompt> {
  const cached = cache.get(stage);
  if (cached && cached.expiry > Date.now()) return cached.data;

  try {
    const supabase = createAdminClient();

    const [promptResult, kbResult] = await Promise.all([
      supabase
        .from("prompt_configs")
        .select("prompt_text")
        .eq("stage", stage)
        .eq("is_active", true)
        .single(),
      supabase
        .from("knowledge_base_files")
        .select("file_name, extracted_text")
        .eq("stage", stage),
    ]);

    const knowledgeContext = (kbResult.data ?? [])
      .filter((f): f is typeof f & { extracted_text: string } => Boolean(f.extracted_text))
      .map((f) => `--- ${f.file_name} ---\n${f.extracted_text}`)
      .join("\n\n");

    const result: ResolvedPrompt = {
      promptText: promptResult.data?.prompt_text ?? "",
      knowledgeContext,
    };

    cache.set(stage, { data: result, expiry: Date.now() + CACHE_TTL_MS });
    return result;
  } catch (err) {
    console.warn(`[prompt-resolver] Failed to resolve prompt for ${stage}:`, err);
    return { promptText: "", knowledgeContext: "" };
  }
}

/**
 * Replace {{variable}} placeholders in a prompt template.
 */
export function interpolatePrompt(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

/**
 * Append knowledge base context to a prompt if available.
 */
export function appendKnowledgeBase(prompt: string, knowledgeContext: string): string {
  if (!knowledgeContext.trim()) return prompt;
  return `${prompt}\n\n--- Contesto aggiuntivo dalla Knowledge Base ---\n${knowledgeContext}`;
}

/**
 * Clear cache for a specific stage (called after prompt updates).
 */
export function clearPromptCache(stage?: PipelineStage): void {
  if (stage) {
    cache.delete(stage);
  } else {
    cache.clear();
  }
}
