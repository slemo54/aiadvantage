import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WORKFLOW_STATES, WORKFLOW_LABELS } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Calendario Editoriale</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW_STATES.map((state) => (
          <Card key={state}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {WORKFLOW_LABELS[state]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <p className="text-muted-foreground">
          Il calendario editoriale verrà implementato con vista settimanale e drag-and-drop.
        </p>
      </div>
    </div>
  );
}
