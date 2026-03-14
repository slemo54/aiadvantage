import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/gemini";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolvePrompt, interpolatePrompt, appendKnowledgeBase } from "@/lib/ai/prompt-resolver";
import { CATEGORIES, type CategoryKey } from "@/lib/constants";

const CATEGORY_ART_DIRECTIONS: Record<
  CategoryKey,
  {
    visualStyle: string;
    subjects: string;
    composition: string;
    accentMood: string;
  }
> = {
  casi_duso: {
    visualStyle: "editorial-grade cinematic illustration mixed with realistic product storytelling",
    subjects: "professionals, dashboards, automation flows, business outcomes, subtle AI interfaces",
    composition: "clear focal point, practical scenario, strong foreground/background separation",
    accentMood: "useful, credible, business-oriented, optimistic",
  },
  ai_news: {
    visualStyle: "high-end futuristic newsroom visual, polished photoreal render or premium digital illustration",
    subjects: "AI breakthroughs, global signals, abstract data pulses, modern media energy",
    composition: "dynamic diagonal flow, strong motion cues, premium editorial hero framing",
    accentMood: "urgent, current, authoritative, innovative",
  },
  web_dev: {
    visualStyle: "clean technical 3D render or sleek interface-centric illustration",
    subjects: "code systems, browser UI, APIs, components, deployment pipelines, developer workstations",
    composition: "structured grid, interface depth, layered screens and technical elements",
    accentMood: "precise, modern, advanced, builder-focused",
  },
  tools: {
    visualStyle: "sharp product-centric hero art with polished lighting and premium SaaS aesthetics",
    subjects: "AI tools, productivity systems, modular interfaces, comparison metaphors, workflow widgets",
    composition: "single dominant product concept with supporting UI fragments",
    accentMood: "practical, efficient, premium, empowering",
  },
  tutorial: {
    visualStyle: "clear educational illustration with premium editorial tech aesthetics",
    subjects: "guided steps, learning paths, screen walkthroughs, structured visual metaphors",
    composition: "easy-to-read hierarchy, clear center of interest, visual teaching cues",
    accentMood: "helpful, approachable, smart, confidence-building",
  },
  opinioni: {
    visualStyle: "thought-provoking editorial artwork with sophisticated lighting and conceptual symbolism",
    subjects: "human-AI tension, ethics, strategy, future-of-work metaphors, reflective scenes",
    composition: "strong central subject, atmospheric negative space, magazine-cover sensibility",
    accentMood: "reflective, bold, nuanced, intellectually sharp",
  },
};

function cleanTitleForImage(title: string): string {
  return title
    .replace(/["'“”‘’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractVisualKeywords(title: string): string[] {
  const normalized = title.toLowerCase();
  const keywordMap: Array<{ test: RegExp; label: string }> = [
    { test: /agent|agenti/, label: "autonomous AI agents" },
    { test: /automaz|workflow|process/, label: "automation workflows" },
    { test: /chatbot|assistant/, label: "conversational AI interface" },
    { test: /seo|search/, label: "search intelligence" },
    { test: /e-?commerce|shop|vendit/, label: "digital commerce" },
    { test: /marketing|ads|copy/, label: "marketing performance systems" },
    { test: /code|coding|dev|developer/, label: "software engineering environment" },
    { test: /api|integraz|integration/, label: "connected APIs and data pipelines" },
    { test: /video/, label: "video creation pipeline" },
    { test: /image|immagin|design/, label: "generative visual design" },
    { test: /data|analytics|dashboard/, label: "analytics dashboard" },
    { test: /startup|business|azienda|impresa/, label: "business transformation" },
    { test: /productivit|efficienza/, label: "productivity system" },
    { test: /security|privacy|compliance/, label: "cybersecurity and trust" },
  ];

  const matches = keywordMap
    .filter(({ test }) => test.test(normalized))
    .map(({ label }) => label);

  return matches.slice(0, 4);
}

function buildImagePrompt(title: string, category: CategoryKey): string {
  const artDirection = CATEGORY_ART_DIRECTIONS[category] ?? CATEGORY_ART_DIRECTIONS.ai_news;
  const categoryMeta = CATEGORIES[category];
  const cleanTitle = cleanTitleForImage(title);
  const visualKeywords = extractVisualKeywords(cleanTitle);
  const keywordSentence = visualKeywords.length
    ? `Important visual cues to incorporate naturally: ${visualKeywords.join(", ")}. `
    : "";

  return [
    `Create an original premium 16:9 hero image for an Italian AI and technology publication named ilvantaggioai.it.`,
    `Article title: ${cleanTitle}.`,
    `Article category: ${categoryMeta?.label ?? category}.`,
    `Goal: communicate the core idea of the article instantly, at thumbnail size and at full-width blog header size.`,
    `Visual style: ${artDirection.visualStyle}.`,
    `Primary subjects: ${artDirection.subjects}.`,
    `Composition: ${artDirection.composition}.`,
    `Mood: ${artDirection.accentMood}.`,
    keywordSentence,
    `Use a refined palette based on deep midnight blue, near-black backgrounds, electric cyan, violet highlights, and subtle luminous accents.`,
    `The image must feel premium, editorial, modern, believable, and not generic stock art.`,
    `Prefer one strong concept with a clean focal subject, cinematic lighting, layered depth, high contrast, and elegant negative space for blog UI overlays.`,
    `If humans are present, make them realistic, contemporary European professionals, natural poses, anatomically correct hands, clean faces, no uncanny expressions.`,
    `Avoid clutter, chaotic collage, low-detail scenes, flat icon-only illustrations, childish style, cartoon style, and overused sci-fi clichés unless directly relevant.`,
    `Absolutely no text, no letters, no captions, no UI labels, no logos, no watermarks, no brand names, no interface gibberish, no visible readable words.`,
    `Do not split the canvas into multiple panels. Do not create infographic layouts. Do not create poster typography.`,
    `Output should look like a magazine-quality technology cover image suitable for a serious blog post.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildImageRetryPrompt(title: string, category: CategoryKey): string {
  const basePrompt = buildImagePrompt(title, category);

  return [
    basePrompt,
    `Second variation: make the concept even simpler and stronger.`,
    `Use a single hero subject or one dominant scene, with cleaner composition and fewer objects.`,
    `Increase realism, depth, and lighting quality. Reduce abstract noise.`,
    `Ensure the image reads well even when cropped in a blog card.`,
  ].join(" ");
}

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato. Aggiungi NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY su Vercel." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("articleId" in body) ||
      typeof (body as Record<string, unknown>).articleId !== "string"
    ) {
      return NextResponse.json(
        { error: "articleId (string) richiesto nel body" },
        { status: 400 }
      );
    }

    const { articleId } = body as { articleId: string };

    const supabase = createAdminClient();

    const { data: article, error: fetchError } = await supabase
      .from("articles")
      .select("id, title, category, status, meta_description")
      .eq("id", articleId)
      .single();

    if (fetchError || !article) {
      return NextResponse.json(
        { error: `Articolo non trovato: ${fetchError?.message ?? "id sconosciuto"}` },
        { status: 404 }
      );
    }

    const articleCategory = article.category as CategoryKey;
    const articleTitle = article.title as string;
    const articleDescription = typeof article.meta_description === "string" ? article.meta_description : "";

    // Resolve prompt from DB or fallback to hardcoded
    const { promptText: dbImgPrompt, knowledgeContext: imgKB } = await resolvePrompt("images");
    const fallbackPrompt = buildImagePrompt(articleTitle, articleCategory);
    const fallbackRetryPrompt = buildImageRetryPrompt(articleTitle, articleCategory);

    const imagePrompt = dbImgPrompt
      ? appendKnowledgeBase(
          interpolatePrompt(dbImgPrompt, {
            title: articleTitle,
            category: articleCategory,
            meta_description: articleDescription,
          }),
          imgKB
        )
      : fallbackPrompt;

    let imageDataUri = await generateImage(imagePrompt);

    if (!imageDataUri) {
      console.warn(`[workflow/images] Prima generazione fallita per articolo ${articleId}, provo prompt alternativo.`);
      imageDataUri = await generateImage(
        dbImgPrompt
          ? appendKnowledgeBase(
              `${imagePrompt}\n\nRetry instructions: simplify the scene, improve focal clarity, increase realism, remove extra elements, preserve all no-text constraints.`,
              imgKB
            )
          : fallbackRetryPrompt
      );
    }

    if (!imageDataUri) {
      // Non-fatal: continue without image and move to reviewing
      await supabase
        .from("articles")
        .update({ status: "reviewing", updated_at: new Date().toISOString() })
        .eq("id", articleId);

      return NextResponse.json({
        success: true,
        articleId,
        hero_image_url: null,
        warning: "Gemini non ha restituito un'immagine. Articolo in revisione senza hero image.",
      });
    }

    const { error: updateError } = await supabase
      .from("articles")
      .update({
        hero_image_url: imageDataUri,
        status: "reviewing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      articleId,
      hero_image_url: imageDataUri.slice(0, 60) + "…[base64]",
    });
  } catch (err) {
    console.error("[workflow/images] Errore:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
