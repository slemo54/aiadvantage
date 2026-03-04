"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialCalendar } from "@/components/admin/editorial-calendar";

export default function CalendarPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <h1 className="text-xl font-semibold">Calendario Editoriale</h1>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Nuovo Articolo
        </Button>
      </header>
      <div className="flex-1 overflow-hidden">
        <EditorialCalendar />
      </div>
    </div>
  );
}
