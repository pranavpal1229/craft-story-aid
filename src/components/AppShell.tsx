import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, User, FileText, GraduationCap, LogOut } from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/persona", label: "Applicant Profile", icon: User },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/lesson", label: "Interactive Lessons", icon: GraduationCap },
] as const;

export function AppShell() {
  const loc = useLocation();
  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-border bg-card md:block">
        <div className="flex h-full flex-col">
          <Link to="/dashboard" className="flex items-center gap-2 border-b border-border p-6">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-primary text-primary-foreground">
              <span className="font-display text-lg font-bold">B</span>
            </div>
            <span className="font-display text-xl font-semibold">Bellcurve</span>
          </Link>
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((n) => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-3">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Log out
            </Link>
          </div>
        </div>
      </aside>
      <main className="bg-background">
        <Outlet />
      </main>
    </div>
  );
}
