"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  Share2, 
  Bookmark, 
  ThumbsUp, 
  MessageCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";

// ─── Table of Contents Component ──────────────────────────────────────────────

interface TocItem {
  id: string;
  label: string;
  level: number;
}

function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <nav className="sticky top-24">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Indice dei Contenuti
      </p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-start gap-2 text-sm text-zinc-400 transition-colors hover:text-indigo-400"
              style={{ paddingLeft: item.level > 1 ? `${(item.level - 1) * 12}px` : 0 }}
            >
              <span className="text-zinc-600">{index + 1}.</span>
              <span className="line-clamp-2">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Related Articles Component ───────────────────────────────────────────────

const RELATED_ARTICLES = [
  {
    id: "1",
    title: "AI Chip Italiani: La sfida europea",
    category: "ai_news" as CategoryKey,
    image: "gradient",
    gradient: "from-cyan-800 to-blue-700",
    description: "Un'analisi sull'hardware che alimenterà la prossima generazione di startup europee.",
  },
  {
    id: "2",
    title: "GDPR e LLM: Come proteggere i dati",
    category: "opinioni" as CategoryKey,
    image: "gradient",
    gradient: "from-emerald-800 to-teal-700",
    description: "Le linee guida aggiornate per l'uso dell'IA generativa in azienda.",
  },
  {
    id: "3",
    title: "Prompt Engineering: Corso Intensivo",
    category: "tutorial" as CategoryKey,
    image: "gradient",
    gradient: "from-purple-800 to-violet-700",
    description: "Impara a parlare con le macchine per ottenere risultati professionali.",
  },
];

function RelatedArticles() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Articoli Correlati</h2>
          <Link 
            href="/blog" 
            className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Vedi tutti
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED_ARTICLES.map((article) => (
            <Link key={article.id} href={`/blog/${article.id}`} className="group block">
              <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700">
                <div className={`relative h-40 bg-gradient-to-br ${article.gradient}`}>
                  <div 
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <span
                    className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: `${CATEGORIES[article.category].accent}cc` }}
                  >
                    {CATEGORIES[article.category].label}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 text-sm font-bold text-zinc-100 group-hover:text-white">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-zinc-500">
                    {article.description}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter CTA Component ─────────────────────────────────────────────────

function ArticleNewsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="border-t border-zinc-800 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:flex-row sm:p-10">
          <div className="text-center sm:text-left">
            <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Ricevi il vantaggio dell&apos;IA ogni mattina
            </h3>
            <p className="text-sm text-indigo-100">
              Unisciti a 15,000+ professionisti che ricevono le nostre analisi esclusive.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2 sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Il tuo indirizzo email"
              className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Button className="bg-white text-indigo-600 hover:bg-white/90">
              Iscriviti
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Main Article Page ────────────────────────────────────────────────────────

const PLACEHOLDER_ARTICLE: Article = {
  id: "1",
  title: "Il Futuro dell'IA Generativa in Italia: Oltre l'Automazione",
  slug: "futuro-ia-generativa-italia",
  content_html: `
    <p class="lead text-lg text-zinc-300 leading-relaxed mb-6">
      "L'adozione dell'intelligenza artificiale non è più una scelta tecnologica, ma un imperativo geopolitico. 
      L'Italia si trova a un bivio cruciale tra sovranità digitale e dipendenza tecnologica."
    </p>
    
    <h2 id="panorama" class="text-2xl font-bold text-white mt-8 mb-4">Il panorama dell'infrastruttura nazionale</h2>
    <p class="text-zinc-400 leading-relaxed mb-4">
      L'Italia sta investendo massicciamente nel potenziamento dei propri data center. Recentemente, 
      il governo ha annunciato un piano di investimenti da 1 miliardo di euro per sostenere le startup locali 
      che sviluppano Large Language Models (LLM) addestrati specificamente sulla nostra cultura e lingua.
    </p>
    <ul class="list-disc list-inside text-zinc-400 space-y-2 mb-6 ml-4">
      <li>Sviluppo di centri di calcolo ad alte prestazioni (HPC)</li>
      <li>Protocolli di sicurezza per i dati aziendali sensibili</li>
      <li>Formazione di talenti specializzati nel prompt engineering</li>
    </ul>

    <h2 id="trend" class="text-2xl font-bold text-white mt-8 mb-4">Trend emergenti e Small Language Models</h2>
    <p class="text-zinc-400 leading-relaxed mb-4">
      Mentre i giganti americani puntano sulla scala globale, le aziende italiane stanno scoprendo il valore 
      dei modelli più piccoli e specializzati. Questi modelli offrono prestazioni superiori in ambiti di nicchia 
      come la giurisprudenza italiana o la gestione del patrimonio artistico.
    </p>

    <h2 id="caso-studio" class="text-2xl font-bold text-white mt-8 mb-4">Caso Studio: Dal Manifatturiero al Retail</h2>
    <p class="text-zinc-400 leading-relaxed mb-4">
      Prendiamo l'esempio di una storica azienda tessile del distretto di Prato che ha integrato l'IA per 
      prevedere i trend di moda con 6 mesi di anticipo, riducendo gli sprechi di magazzino del 22%. 
      Il futuro è adesso.
    </p>
    <p class="text-zinc-400 leading-relaxed mb-6">
      La conclusione è chiara: l'Italia non deve solo "usare" l'IA, ma deve imparare a "governarla". 
      Il vantaggio competitivo risiede nella nostra capacità unica di unire creatività e rigore tecnologico.
    </p>
  `,
  status: "published",
  category: "ai_news",
  freshness_score: 94,
  hero_image_url: null,
  meta_description: "Analisi strategica sul futuro dell'IA generativa in Italia: oltre l'automazione, verso la sovranità digitale.",
  keywords: ["AI", "Italia", "generativa", "sovranità digitale"],
  published_at: "2026-03-01T10:00:00Z",
  created_at: "2026-03-01T08:00:00Z",
  updated_at: "2026-03-01T10:00:00Z",
};

const TOC_ITEMS: TocItem[] = [
  { id: "panorama", label: "Il panorama dell'infrastruttura nazionale", level: 1 },
  { id: "trend", label: "Trend emergenti e Small Language Models", level: 1 },
  { id: "caso-studio", label: "Caso Studio: Dal Manifatturiero al Retail", level: 1 },
  { id: "conclusioni", label: "Conclusioni", level: 1 },
];

export default function BlogArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article>(PLACEHOLDER_ARTICLE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles?slug=${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.articles?.[0]) {
            setArticle(data.articles[0]);
          }
        }
      } catch {
        // Use placeholder
      } finally {
        setIsLoading(false);
      }
    }
    void loadArticle();
  }, [params.slug]);

  const category = CATEGORIES[article.category];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-32 w-full max-w-2xl animate-pulse rounded-xl bg-zinc-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-zinc-950 to-zinc-950" />
        
        {/* Hero Image / Visual */}
        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950">
            <div className="relative flex h-full items-center justify-center">
              {/* Abstract brain/network visual */}
              <svg className="h-48 w-48 text-cyan-400/30" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" />
                <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="20" r="3" fill="currentColor" />
                <circle cx="50" cy="80" r="3" fill="currentColor" />
                <circle cx="20" cy="50" r="3" fill="currentColor" />
                <circle cx="80" cy="50" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Sidebar - TOC (Desktop) */}
          <aside className="hidden lg:col-span-3 lg:block">
            <TableOfContents items={TOC_ITEMS} />
          </aside>

          {/* Main Article */}
          <article className="lg:col-span-6">
            {/* Category & Meta */}
            <div className="mb-4 flex items-center gap-3">
              <Badge 
                className="text-xs font-semibold"
                style={{ backgroundColor: category.accent, color: "white" }}
              >
                ANALISI STRATEGICA
              </Badge>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {article.title}
            </h1>

            {/* Author & Actions */}
            <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Anselmo Acquah</p>
                  <p className="text-xs text-zinc-500">AI Policy Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Reading Time Card */}
            <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="h-4 w-4" />
                <span className="font-medium">8 min</span>
                <span>di lettura</span>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-strong:text-zinc-200 prose-li:text-zinc-400"
              dangerouslySetInnerHTML={{ __html: article.content_html || "" }}
            />

            {/* CTA Box */}
            <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">
                Vuoi implementare l&apos;IA nel tuo business?
              </h3>
              <p className="mb-4 text-sm text-zinc-400">
                Scarica il nostro whitepaper gratuito sulle migliori strategie per le PMI italiane nel 2024.
              </p>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
                Scarica la Guida
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>

            {/* Engagement */}
            <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Mi piace
                </Button>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Commenta
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span>Condividi su:</span>
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded bg-blue-600" />
                  <div className="h-6 w-6 rounded bg-sky-500" />
                </div>
              </div>
            </div>
          </article>

          {/* Right Sidebar - Sticky */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Back to blog */}
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Torna al blog
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      <RelatedArticles />

      {/* Newsletter */}
      <ArticleNewsletter />
    </div>
  );
}
