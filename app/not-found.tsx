import Link from "next/link";
import { ArrowLeft, Search, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900">
          <FileQuestion className="h-12 w-12 text-zinc-600" />
        </div>

        {/* Error Code */}
        <h1 className="mb-4 text-8xl font-bold text-zinc-800">404</h1>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-bold text-white">
          Pagina non trovata
        </h2>

        {/* Description */}
        <p className="mb-8 max-w-md text-zinc-400">
          La pagina che stai cercando non esiste o è stata spostata. 
          Controlla l&apos;URL o torna alla homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla Home
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Search className="mr-2 h-4 w-4" />
              Esplora il Blog
            </Button>
          </Link>
        </div>

        {/* Suggested Links */}
        <div className="mt-12 border-t border-zinc-800 pt-8">
          <p className="mb-4 text-sm text-zinc-500">Potrebbero interessarti:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              href="/blog?category=ai_news" 
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              AI News
            </Link>
            <span className="text-zinc-700">·</span>
            <Link 
              href="/blog?category=tutorial" 
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Tutorial
            </Link>
            <span className="text-zinc-700">·</span>
            <Link 
              href="/about" 
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
