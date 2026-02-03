"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Home, User, Settings, LogOut, Menu, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const items = [
  { title: "Home", href: "/", icon: Home },
  { title: "Perfil", href: "/profile", icon: User },
  { title: "Configurações", href: "/settings", icon: Settings },
];

function SidebarContent({
  collapsed,
  pathname,
  onToggle,
}: {
  collapsed: boolean;
  pathname: string;
  onToggle?: () => void;
}) {
  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-background",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && <span className="font-semibold">StudyFocus</span>}
        <ChevronLeft
          className={cn(
            "h-5 w-5 cursor-pointer transition-transform",
            collapsed && "rotate-180",
          )}
          onClick={onToggle}
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm ",
                active ? "bg-muted font-medium" : "hover:bg-muted",
                collapsed && "justify-center",
              )}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sair"}
        </Button>
      </div>
    </aside>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // esconde sidebar em rotas específicas
  if (pathname.startsWith("/login")) return null;

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden fixed left-4 top-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent collapsed={false} pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <SidebarContent
          collapsed={collapsed}
          pathname={pathname}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>
    </>
  );
}
