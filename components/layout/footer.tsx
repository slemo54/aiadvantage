import Link from "next/link";
import { SITE_NAME, CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-bold">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              Il blog italiano sull&apos;Intelligenza Artificiale. Casi d&apos;uso
              reali, tutorial e opinioni.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Categorie</h4>
            <ul className="space-y-1">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <li key={key}>
                  <Link
                    href={`/?category=${key}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Link</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
