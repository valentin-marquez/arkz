// sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  items: { title: string; href: string }[];
}

const Sidebar = ({ items }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[200px] flex-col md:flex">
      <ScrollArea className="flex h-screen w-full flex-col border-r">
        <div className="flex-1 space-y-1 p-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Admin Panel
          </h2>
          <nav className="flex flex-col space-y-1">
            {items.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                disabled={pathname === item.href}
                asChild
              >
                <Link href={item.href}>{item.title}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
