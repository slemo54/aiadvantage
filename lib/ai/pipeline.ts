import type { WorkflowState } from "@/lib/constants";

const VALID_TRANSITIONS: Record<WorkflowState, WorkflowState | null> = {
  idea: "researching",
  researching: "drafting",
  drafting: "humanizing",
  humanizing: "reviewing",
  reviewing: "ready",
  ready: "published",
  published: null,
};

const STATE_ROUTES: Partial<Record<WorkflowState, string>> = {
  researching: "/api/cron/generate-ideas",
  drafting: "/api/workflow/draft",
  humanizing: "/api/workflow/humanize",
  reviewing: "/api/workflow/images",
};

export function getNextState(current: WorkflowState): WorkflowState | null {
  return VALID_TRANSITIONS[current];
}

export function isValidTransition(from: WorkflowState, to: WorkflowState): boolean {
  return VALID_TRANSITIONS[from] === to;
}

export async function advanceState(
  articleId: string,
  currentStatus: WorkflowState
): Promise<{ success: boolean; newStatus: WorkflowState | null; error?: string }> {
  const nextStatus = getNextState(currentStatus);
  if (!nextStatus) {
    return { success: false, newStatus: null, error: "No valid next state" };
  }

  const route = STATE_ROUTES[nextStatus];
  if (route) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });
      if (!res.ok) throw new Error(`Route ${route} returned ${res.status}`);
    } catch (err) {
      return { success: false, newStatus: null, error: String(err) };
    }
  }

  return { success: true, newStatus: nextStatus };
}
