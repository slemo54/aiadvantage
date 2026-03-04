"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Circle,
  MoreHorizontal
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CATEGORIES, WORKFLOW_LABELS, WORKFLOW_COLORS } from "@/lib/constants";
import type { CategoryKey, WorkflowState } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarArticle {
  id: string;
  title: string;
  scheduledDate: Date;
  status: WorkflowState;
  category: CategoryKey;
  author: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_ARTICLES: CalendarArticle[] = [
  {
    id: "1",
    title: "Claude 3.7: Il nuovo standard per il coding",
    scheduledDate: new Date(2026, 2, 5),
    status: "published",
    category: "ai_news",
    author: "Anselmo",
  },
  {
    id: "2",
    title: "Come implementare RAG in produzione",
    scheduledDate: new Date(2026, 2, 8),
    status: "ready",
    category: "tutorial",
    author: "Anselmo",
  },
  {
    id: "3",
    title: "AI Act: Guida pratica per startup",
    scheduledDate: new Date(2026, 2, 12),
    status: "reviewing",
    category: "opinioni",
    author: "Anselmo",
  },
  {
    id: "4",
    title: "Open Source AI: Il caso Mistral",
    scheduledDate: new Date(2026, 2, 15),
    status: "drafting",
    category: "ai_news",
    author: "Anselmo",
  },
  {
    id: "5",
    title: "Automazione workflow con n8n e AI",
    scheduledDate: new Date(2026, 2, 18),
    status: "researching",
    category: "tools",
    author: "Anselmo",
  },
  {
    id: "6",
    title: "Futuro del lavoro: AI e creatività",
    scheduledDate: new Date(2026, 2, 22),
    status: "idea",
    category: "casi_duso",
    author: "Anselmo",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

function getStatusIcon(status: WorkflowState) {
  switch (status) {
    case "published":
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
    case "ready":
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />;
    case "reviewing":
      return <AlertCircle className="h-3.5 w-3.5 text-purple-400" />;
    case "drafting":
    case "humanizing":
      return <Clock className="h-3.5 w-3.5 text-yellow-400" />;
    default:
      return <Circle className="h-3.5 w-3.5 text-zinc-500" />;
  }
}

// ─── Components ───────────────────────────────────────────────────────────────

function CalendarDay({ 
  date, 
  articles, 
  isToday,
  isCurrentMonth 
}: { 
  date: Date; 
  articles: CalendarArticle[];
  isToday: boolean;
  isCurrentMonth: boolean;
}) {
  return (
    <div 
      className={[
        "min-h-[120px] border-b border-r border-border p-2 transition-colors",
        !isCurrentMonth && "bg-muted/30 text-muted-foreground",
        isToday && "bg-primary/5",
      ].join(" ")}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className={[
          "text-sm font-medium",
          isToday && "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground",
        ].join(" ")}>
          {date.getDate()}
        </span>
        {articles.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {articles.length} art.
          </span>
        )}
      </div>
      <div className="space-y-1">
        {articles.slice(0, 3).map((article) => (
          <div
            key={article.id}
            className="group cursor-pointer rounded-md border border-border bg-card p-1.5 text-xs transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="mb-1 flex items-center gap-1">
              {getStatusIcon(article.status)}
              <span 
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: CATEGORIES[article.category].accent }}
              />
            </div>
            <p className="line-clamp-2 font-medium leading-tight text-foreground">
              {article.title}
            </p>
          </div>
        ))}
        {articles.length > 3 && (
          <div className="flex items-center justify-center py-1">
            <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EditorialCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [articles] = useState<CalendarArticle[]>(MOCK_ARTICLES);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  // Get articles for a specific date
  const getArticlesForDate = (date: Date): CalendarArticle[] => {
    return articles.filter(
      (article) =>
        article.scheduledDate.getDate() === date.getDate() &&
        article.scheduledDate.getMonth() === date.getMonth() &&
        article.scheduledDate.getFullYear() === date.getFullYear()
    );
  };

  // Generate calendar days
  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];
  
  // Previous month days
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const weekDays = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  return (
    <div className="flex h-full flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold capitalize">
            {formatMonthYear(currentDate)}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="hidden items-center gap-4 text-xs text-muted-foreground lg:flex">
          {Object.entries(WORKFLOW_LABELS).slice(0, 4).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${WORKFLOW_COLORS[key as WorkflowState]}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7">
          {calendarDays.map(({ date, isCurrentMonth }, index) => (
            <CalendarDay
              key={index}
              date={date}
              articles={getArticlesForDate(date)}
              isToday={
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
              }
              isCurrentMonth={isCurrentMonth}
            />
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Articoli pianificati:</span>
            <span className="font-semibold">{articles.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Da pubblicare:</span>
            <span className="font-semibold text-green-600">
              {articles.filter((a) => a.status === "ready").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">In revisione:</span>
            <span className="font-semibold text-purple-600">
              {articles.filter((a) => a.status === "reviewing").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
