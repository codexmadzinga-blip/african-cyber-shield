import { Link, useLocation } from "wouter";
import { Shield, LayoutDashboard, List, Info, Menu, History as HistoryIcon, KeyRound, Smartphone, Mail, LogIn, LogOut, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@workspace/replit-auth-web";

const navItems = [
  { name: "URL Analyzer",      href: "/analyzer", icon: LayoutDashboard },
  { name: "Batch Scanner",     href: "/batch",    icon: List },
  { name: "Scan History",      href: "/history",  icon: HistoryIcon },
  { name: "Password Checker",  href: "/password", icon: KeyRound },
  { name: "2FA Setup Guide",   href: "/2fa",      icon: Smartphone },
  { name: "About",             href: "/about",    icon: Info },
  { name: "Contact",           href: "/contact",  icon: Mail },
];

function NavLink({ href, icon: Icon, name, active }: { href: string; icon: React.ElementType; name: string; active: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}>
        <Icon className="h-5 w-5 shrink-0" />
        <span className="truncate">{name}</span>
      </div>
    </Link>
  );
}

function AuthSection({ compact = false }: { compact?: boolean }) {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Account";
    return (
      <div className={`flex items-center gap-2 ${compact ? "p-2" : "p-4"}`}>
        {user.profileImageUrl ? (
          <img src={user.profileImageUrl} alt={displayName} className="h-7 w-7 rounded-full object-cover shrink-0" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-sidebar-primary/20 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-sidebar-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-sidebar-foreground truncate">{displayName}</p>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-3 w-3" /> Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "p-2" : "p-4"}>
      <Button
        size="sm"
        variant="outline"
        className="w-full text-xs gap-1.5 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
        onClick={login}
      >
        <LogIn className="h-3.5 w-3.5" />
        Log in
      </Button>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex w-full flex-col md:flex-row bg-background">
      {/* Mobile Nav Header */}
      <header className="flex md:hidden h-16 items-center px-4 border-b bg-sidebar text-sidebar-foreground w-full justify-between shrink-0">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Shield className="h-6 w-6 text-sidebar-primary" />
          <span>African Cyber Shield</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground border-sidebar-border p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full py-6">
              <div className="flex items-center gap-2 px-6 font-bold text-xl tracking-tight mb-8">
                <Shield className="h-7 w-7 text-sidebar-primary" />
                <span>Cyber Shield</span>
              </div>
              <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href} icon={item.icon} name={item.name} active={location === item.href} />
                ))}
              </nav>
              <div className="border-t border-sidebar-border/50 mt-4">
                <AuthSection compact />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-5 h-16 font-bold text-lg tracking-tight border-b border-sidebar-border/50">
          <Shield className="h-6 w-6 text-sidebar-primary" />
          <span className="truncate">African Cyber Shield</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} icon={item.icon} name={item.name} active={location === item.href} />
          ))}
        </nav>
        <div className="border-t border-sidebar-border/50">
          <AuthSection />
          <div className="px-4 pb-4 flex gap-3 text-xs text-sidebar-foreground/40">
            <Link href="/terms"><span className="hover:text-sidebar-foreground/70 cursor-pointer transition-colors">Terms</span></Link>
            <Link href="/privacy"><span className="hover:text-sidebar-foreground/70 cursor-pointer transition-colors">Privacy</span></Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
