import type { CategoryKey, PipelineStage, WorkflowState } from "./constants";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content_html: string | null;
  status: WorkflowState;
  category: CategoryKey;
  freshness_score: number;
  hero_image_url: string | null;
  meta_description: string | null;
  keywords: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  topic: string;
  source_url: string | null;
  freshness_score: number;
  status: "new" | "selected" | "rejected" | "used";
  category: CategoryKey;
  perplexity_research: Record<string, unknown> | null;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
}

export interface CalendarEntry {
  id: string;
  article_id: string | null;
  idea_id: string | null;
  scheduled_date: string;
  status: "planned" | "in_progress" | "completed" | "skipped";
  created_at: string;
}

export interface PipelineState {
  article_id: string;
  current_status: WorkflowState;
  started_at: string;
  error: string | null;
}

export interface PromptConfig {
  id: string;
  stage: PipelineStage;
  prompt_text: string;
  version: number;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export interface KnowledgeBaseFile {
  id: string;
  stage: PipelineStage;
  file_name: string;
  file_type: string;
  storage_path: string;
  extracted_text: string | null;
  file_size_bytes: number;
  created_at: string;
}
