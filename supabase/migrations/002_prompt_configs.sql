-- Prompt Configs & Knowledge Base tables for AI pipeline management

-- Enum for pipeline stages
CREATE TYPE pipeline_stage AS ENUM (
  'research', 'draft', 'humanize', 'images', 'seo'
);

-- Prompt configs with version history
CREATE TABLE prompt_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage pipeline_stage NOT NULL,
  prompt_text TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT 'admin'
);

-- Only one active prompt per stage
CREATE UNIQUE INDEX idx_prompt_configs_active_stage
  ON prompt_configs (stage) WHERE is_active = true;

CREATE INDEX idx_prompt_configs_stage_version
  ON prompt_configs (stage, version DESC);

-- Knowledge base file metadata
CREATE TABLE knowledge_base_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage pipeline_stage NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('md')),
  storage_path TEXT NOT NULL,
  extracted_text TEXT,
  file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 5242880),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kb_files_stage ON knowledge_base_files (stage);

-- RLS
ALTER TABLE prompt_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access prompt_configs"
  ON prompt_configs FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access knowledge_base_files"
  ON knowledge_base_files FOR ALL
  USING (auth.role() = 'service_role');

-- Seed with current hardcoded prompts as version 1
INSERT INTO prompt_configs (stage, prompt_text, version, is_active) VALUES
  ('research', E'Sei un ricercatore esperto di tecnologia e intelligenza artificiale.\nAnalizza le ultime tendenze AI degli ultimi 3 giorni.\n\nTrova 5 topic interessanti per un blog italiano sull''AI, focalizzandoti su:\n- Nuovi strumenti e tool AI\n- Casi d''uso pratici per professionisti e aziende\n- Novit\u00e0 da OpenAI, Anthropic, Google, Meta\n- Impatto dell''AI sul lavoro e sulla societ\u00e0 italiana\n- Tutorial pratici per sviluppatori\n\nPer ogni topic fornisci:\n1. Titolo proposto (in italiano, max 80 caratteri)\n2. Breve descrizione (2-3 frasi)\n3. Fonti principali (URL)\n4. Categoria suggerita: casi_duso | ai_news | web_dev | tools | tutorial | opinioni\n5. Punteggio freschezza (0-100, quanto \u00e8 attuale)\n\nRispondi SOLO con un array JSON valido, senza testo aggiuntivo, nel formato:\n[\n  {\n    "titolo": "...",\n    "descrizione": "...",\n    "fonti": ["url1", "url2"],\n    "categoria": "ai_news",\n    "freshness_score": 85\n  }\n]', 1, true),

  ('draft', E'Sei un content writer esperto di tecnologia e AI.\nScrivi un articolo blog in italiano basandoti su questa ricerca:\n\n{{research}}\n\nRequisiti:\n- Titolo accattivante (max 80 caratteri)\n- Introduzione che cattura l''attenzione (2-3 paragrafi)\n- 3-5 sezioni con sottotitoli H2\n- Esempi pratici e casi d''uso concreti relativi alla categoria: {{category}}\n- Conclusione con call-to-action\n- Lunghezza: 1200-1800 parole\n- Tono: professionale ma accessibile\n- Target: professionisti italiani interessati all''AI\n\nFormatta in HTML (h2, p, ul, li, strong, em). Non usare h1 (\u00e8 nel layout).\nRispondi SOLO con l''HTML dell''articolo, senza markdown o testo aggiuntivo.', 1, true),

  ('humanize', E'Sei un editor esperto che rende i testi AI pi\u00f9 naturali e coinvolgenti.\n\nRiscrivi questo articolo mantenendo il contenuto ma migliorando:\n- Tono conversazionale naturale (non robotico)\n- Transizioni fluide tra le sezioni\n- Espressioni idiomatiche italiane dove appropriato\n- Variazione nella struttura delle frasi\n- Rimuovi ripetizioni e frasi generiche\n- Aggiungi opinioni e prospettive personali dove possibile\n\nArticolo originale:\n{{draft}}\n\nMantieni il formato HTML. Non modificare i fatti o le fonti citate.\nRispondi SOLO con l''HTML dell''articolo riscritto, senza markdown o testo aggiuntivo.', 1, true),

  ('images', E'Professional blog hero image for an Italian AI technology article. Article title: "{{title}}". Category: {{category}}. Style: modern, clean, tech-focused, abstract digital illustration. Colors: deep blue and purple gradient with bright accents. No text, no letters, no words in the image. Photorealistic quality.', 1, true),

  ('seo', E'Sei un esperto SEO italiano. Analizza questo articolo e restituisci SOLO un JSON valido senza markdown:\n{\n  "meta_description": "massimo 155 caratteri, include keyword principale, chiara e invitante",\n  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],\n  "slug": "url-slug-ottimizzato-senza-accenti"\n}\nTitolo: {{title}}\nContenuto:\n{{content}}', 1, true);
