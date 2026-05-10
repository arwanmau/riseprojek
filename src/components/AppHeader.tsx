import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Leaf, LayoutGrid, QrCode, ShieldCheck, Sun, Moon, LogOut, LogIn, Radio, Sparkles, Crown } from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";
import { DeviceSwitcher } from "./DeviceSwitcher";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function AppHeader() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const NavLink = ({ to, label, Icon }: { to: string; label: string; Icon: typeof Leaf }) => {
    const active = path === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout");
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">Global Food Ledger</div>
            <div className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:block">
              <ShieldCheck className="mr-1 inline h-2.5 w-2.5 text-chain" />
              Secured by Polygon
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" label="Dashboard" Icon={LayoutGrid} />
          <NavLink to="/live" label="Live Map" Icon={Radio} />
          <NavLink to="/insights" label="AI Insights" Icon={Sparkles} />
          <NavLink to="/scan" label="Scan" Icon={QrCode} />
          {user?.isAdmin && <NavLink to="/admin" label="Admin" Icon={Crown} />}
        </nav>

        <div className="flex items-center gap-1.5">
          <DeviceSwitcher />
          {user && <RoleSwitcher />}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105">
                  {user.avatar}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="leading-tight">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="truncate text-[11px] font-normal text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate({ to: "/login" })}
              className="h-9 gap-1.5 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
