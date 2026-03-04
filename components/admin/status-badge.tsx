import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // Idea statuses
  new: { label: "Nuovo", className: "bg-blue-500/20 text-blue-400" },
  selected: { label: "Selezionato", className: "bg-green-500/20 text-green-400" },
  rejected: { label: "Scartato", className: "bg-red-500/20 text-red-400" },
  used: { label: "Usato", className: "bg-gray-500/20 text-gray-400" },
  // Workflow statuses
  idea: { label: "Idea", className: "bg-gray-500/20 text-gray-400" },
  researching: { label: "In Ricerca", className: "bg-blue-500/20 text-blue-400" },
  drafting: { label: "Bozza AI", className: "bg-yellow-500/20 text-yellow-400" },
  humanizing: { label: "Umanizzazione", className: "bg-orange-500/20 text-orange-400" },
  reviewing: { label: "In Revisione", className: "bg-purple-500/20 text-purple-400" },
  ready: { label: "Pronto", className: "bg-green-500/20 text-green-400" },
  published: { label: "Pubblicato", className: "bg-emerald-500/20 text-emerald-400" },
  // Calendar statuses
  planned: { label: "Pianificato", className: "bg-blue-500/20 text-blue-400" },
  in_progress: { label: "In Corso", className: "bg-yellow-500/20 text-yellow-400" },
  completed: { label: "Completato", className: "bg-green-500/20 text-green-400" },
  skipped: { label: "Saltato", className: "bg-gray-500/20 text-gray-400" },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: "bg-gray-500/20 text-gray-400",
  };

  return (
    <Badge variant="outline" className={cn("border-none text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}
