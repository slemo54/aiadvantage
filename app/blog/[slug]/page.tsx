interface BlogPageProps {
  params: { slug: string };
}

export default function BlogPage({ params }: BlogPageProps) {
  // TODO: Fetch article from Supabase by slug
  const { slug } = params;

  return (
    <article className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{slug}</h1>
        <p className="text-muted-foreground">Articolo in arrivo...</p>
      </header>
      <div className="prose prose-invert max-w-none">
        <p>Contenuto dell&apos;articolo verrà caricato da Supabase.</p>
      </div>
    </article>
  );
}
