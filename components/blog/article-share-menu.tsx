"use client";

import { Copy, Bookmark, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { SITE_URL } from "@/lib/constants";

interface ArticleShareMenuProps {
  title: string;
  slug: string;
  contentHtml: string;
}

const AI_SERVICES = [
  { label: "Apri in ChatGPT", icon: "chatgpt", urlBase: "https://chatgpt.com/?q=" },
  { label: "Apri in Claude", icon: "claude", urlBase: "https://claude.ai/new?q=" },
  { label: "Apri in Gemini", icon: "gemini", urlBase: "https://gemini.google.com/app?web=1&q=" },
] as const;

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function ArticleShareMenu({ title, slug, contentHtml }: ArticleShareMenuProps) {
  const { toast } = useToast();
  const articleUrl = `${SITE_URL}/blog/${slug}`;

  async function handleCopyPage() {
    const plainText = stripHtml(contentHtml);
    const textToCopy = `${title}\n\n${plainText}\n\nFonte: ${articleUrl}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({ title: "Copiato!", description: "Articolo copiato negli appunti." });
    } catch {
      toast({ title: "Errore", description: "Impossibile copiare il testo.", variant: "destructive" });
    }
  }

  function handleOpenInAI(urlBase: string) {
    const query = encodeURIComponent(`Read from ${articleUrl} so I can ask questions about it`);
    window.open(`${urlBase}${query}`, "_blank", "noopener,noreferrer");
  }

  return (
    <DropdownMenu>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-r-none border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          onClick={handleCopyPage}
        >
          <Copy className="h-4 w-4" />
          Copia pagina
        </Button>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-none border border-l-0 border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="end" className="w-56 border-zinc-700 bg-zinc-900 text-zinc-200">
        <DropdownMenuItem onClick={handleCopyPage} className="cursor-pointer gap-3 py-2.5 focus:bg-zinc-800 focus:text-white">
          <Copy className="h-4 w-4 text-zinc-400" />
          <div>
            <p className="text-sm font-medium">Copia pagina</p>
            <p className="text-xs text-zinc-500">Copia l&apos;articolo come testo</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer gap-3 py-2.5 focus:bg-zinc-800 focus:text-white">
          <Bookmark className="h-4 w-4 text-zinc-400" />
          <div>
            <p className="text-sm font-medium">Salva nei preferiti</p>
            <p className="text-xs text-zinc-500">Salva per dopo</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-700" />

        <DropdownMenuLabel className="text-xs font-normal text-zinc-500">
          Chiedi all&apos;AI
        </DropdownMenuLabel>

        {AI_SERVICES.map((service) => (
          <DropdownMenuItem
            key={service.icon}
            onClick={() => handleOpenInAI(service.urlBase)}
            className="cursor-pointer gap-3 py-2.5 focus:bg-zinc-800 focus:text-white"
          >
            <ExternalLink className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="text-sm font-medium">{service.label}</p>
              <p className="text-xs text-zinc-500">Fai domande su questo articolo</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
