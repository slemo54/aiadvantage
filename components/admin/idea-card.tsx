import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { StatusBadge } from "./status-badge";
import type { Idea } from "@/lib/types";

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const category = CATEGORIES[idea.category];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <Badge
          variant="outline"
          className="text-xs"
          style={{ borderColor: category.accent, color: category.accent }}
        >
          {category.label}
        </Badge>
        <StatusBadge status={idea.status} />
      </CardHeader>
      <CardContent>
        <h3 className="mb-2 font-semibold leading-tight">{idea.topic}</h3>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Freshness: {idea.freshness_score}%</span>
          {idea.source_url && <span>&middot; Ha fonte</span>}
        </div>
        <Button size="sm" className="w-full">
          Seleziona
        </Button>
      </CardContent>
    </Card>
  );
}
