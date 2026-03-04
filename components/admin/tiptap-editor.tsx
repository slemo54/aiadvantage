"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ImagePlus,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Inizia a scrivere il tuo articolo...",
      }),
    ],
    content: content || DEFAULT_CONTENT,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] p-4",
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML());
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      className={cn("h-8 w-8 p-0", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Grassetto"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Corsivo"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Titolo H2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Titolo H3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista puntata"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerata"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citazione"
        >
          <span className="text-sm font-bold">&ldquo;</span>
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Annulla"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Ripeti"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("URL immagine:");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            title="Aggiungi immagine"
          >
            <ImagePlus className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

const DEFAULT_CONTENT = `
<h1>Il Futuro dell'AI nello Sviluppo Web: Una Guida Completa</h1>
<p>L'Intelligenza Artificiale sta rapidamente trasformando il modo in cui costruiamo e interagiamo con il web. In questo articolo, esploriamo gli strumenti piu' recenti, le tecniche e le implicazioni per sviluppatori e aziende.</p>
<h2>Comprendere il Cambiamento</h2>
<p>L'integrazione dell'AI nello sviluppo web non e' semplicemente una tendenza; e' un cambio di paradigma. Strumenti come GitHub Copilot e modelli linguistici avanzati stanno cambiando il flusso di lavoro quotidiano degli sviluppatori, automatizzando le attivita' ripetitive e suggerendo strutture di codice complesse.</p>
<h3>Aree Chiave di Impatto</h3>
<ul>
<li><strong>Generazione Automatica del Codice:</strong> Gli assistenti AI possono scrivere codice boilerplate, configurare ambienti di test e persino tradurre codice tra linguaggi.</li>
<li><strong>Esperienza Utente Migliorata (UX):</strong> I motori di personalizzazione basati sull'AI analizzano il comportamento degli utenti per adattare contenuti e interfacce in modo dinamico.</li>
<li><strong>Testing e QA Intelligenti:</strong> Strumenti di test automatizzati che utilizzano l'AI possono identificare casi limite e potenziali bug in modo piu' efficace rispetto ai test tradizionali.</li>
</ul>
<h2>Implementare Workflow AI</h2>
<p>Per i team che desiderano adottare queste tecnologie, la transizione richiede una pianificazione attenta. E' fondamentale comprendere i limiti dei modelli AI attuali, in particolare per quanto riguarda la sicurezza e la qualita' del codice.</p>
<blockquote><p>"L'AI non sostituira' gli sviluppatori, ma gli sviluppatori che usano l'AI sostituiranno quelli che non lo fanno." - Proverbio del settore</p></blockquote>
<p>Man mano che procediamo, l'attenzione si spostera' dalla scrittura manuale di ogni riga di codice all'orchestrazione degli strumenti AI e alla curatela dell'output.</p>
`;
