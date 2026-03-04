"use client";

import { useState } from "react";
import { Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { EditorAISidebar } from "@/components/admin/editor-ai-sidebar";

export default function EditorPage() {
  const [, setContent] = useState("");

  return (
    <div className="flex h-full flex-col">
      {/* Editor Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">Editor</h1>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Stato:</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              In Revisione
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Save className="mr-1.5 h-4 w-4" />
            Salva Bozza
          </Button>
          <Button size="sm">
            <Send className="mr-1.5 h-4 w-4" />
            Approva & Pubblica
          </Button>
        </div>
      </header>

      {/* Editor + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <section className="flex-1 overflow-y-auto bg-card p-8 lg:p-12">
          <div className="mx-auto max-w-3xl">
            <TiptapEditor content="" onChange={setContent} />
          </div>
        </section>

        {/* AI Sidebar */}
        <EditorAISidebar />
      </div>
    </div>
  );
}
