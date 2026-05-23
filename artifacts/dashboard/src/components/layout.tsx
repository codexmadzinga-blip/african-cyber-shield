import { Link, useLocation } from "wouter";
import { Shield, LayoutDashboard, List, Info, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "URL Analyzer", href: "/", icon: LayoutDashboard },
  { name: "Batch Scanner", href: "/batch", icon: List },
  { name: "About", href: "/about", icon: Info },
];

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
              <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        isActive 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}>
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-6 h-20 font-bold text-xl tracking-tight border-b border-sidebar-border/50">
          <Shield className="h-7 w-7 text-sidebar-primary" />
          <span>African Cyber Shield</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border/50 text-xs text-sidebar-foreground/50">
          <p>Enterprise Security Tool</p>
          <p className="mt-1">v1.0.0-beta</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
