-- IlVantaggioAI Database Schema

-- Enums
CREATE TYPE article_status AS ENUM (
  'idea', 'researching', 'drafting', 'humanizing', 'reviewing', 'ready', 'published'
);

CREATE TYPE article_category AS ENUM (
  'casi_duso', 'ai_news', 'web_dev', 'tools', 'tutorial', 'opinioni'
);

CREATE TYPE idea_status AS ENUM (
  'new', 'selected', 'rejected', 'used'
);

CREATE TYPE calendar_status AS ENUM (
  'planned', 'in_progress', 'completed', 'skipped'
);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_html TEXT,
  status article_status NOT NULL DEFAULT 'idea',
  category article_category NOT NULL,
  freshness_score INTEGER DEFAULT 0 CHECK (freshness_score >= 0 AND freshness_score <= 100),
  hero_image_url TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ideas
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  source_url TEXT,
  freshness_score INTEGER DEFAULT 0 CHECK (freshness_score >= 0 AND freshness_score <= 100),
  status idea_status NOT NULL DEFAULT 'new',
  category article_category NOT NULL,
  perplexity_research JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Editorial Calendar
CREATE TABLE editorial_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  status calendar_status NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_calendar_scheduled_date ON editorial_calendar(scheduled_date);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_calendar ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles only
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Service role has full access (applied via service_role key)
CREATE POLICY "Service role full access articles"
  ON articles FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access ideas"
  ON ideas FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access subscribers"
  ON subscribers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access calendar"
  ON editorial_calendar FOR ALL
  USING (auth.role() = 'service_role');
