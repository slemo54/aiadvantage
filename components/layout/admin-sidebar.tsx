"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Lightbulb,
  PenTool,
  Bot,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/ideas", label: "Idee & Topic", icon: Lightbulb },
  { href: "/admin/editor", label: "Editor", icon: PenTool },
  { href: "/admin/calendar", label: "Calendario", icon: CalendarDays },
  { href: "/admin/agent", label: "AI Pipelines", icon: Bot },
  { href: "/admin/settings", label: "Impostazioni", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/admin-login");
  }

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin/dashboard" className="text-xl font-bold text-primary">
          IlVantaggioAI.it
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Anselmo</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Esci"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
