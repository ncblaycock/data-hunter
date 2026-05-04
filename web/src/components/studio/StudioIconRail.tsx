"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  Table2,
  TerminalSquare,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StudioIconRail() {
  const pathname = usePathname();
  const overview = pathname === "/dashboard";
  const inTable =
    pathname.startsWith("/dashboard/") && pathname !== "/dashboard";

  return (
    <nav
      className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border bg-studio-rail py-2"
      aria-label="Primary"
    >
      <Link
        href="/dashboard"
        title="Home"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-9 rounded-md text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          overview && "bg-accent/80 text-foreground",
        )}
      >
        <Home className="size-[18px] stroke-[1.5]" />
      </Link>
      <Link
        href="/dashboard/customer-flight-activity"
        title="Table Editor"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-9 rounded-md text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          inTable && "bg-accent/80 text-brand",
        )}
      >
        <Table2 className="size-[18px] stroke-[1.5]" />
      </Link>
      <span
        title="SQL Editor (demo)"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-9 cursor-not-allowed rounded-md opacity-40",
        )}
      >
        <TerminalSquare className="size-[18px] stroke-[1.5]" />
      </span>
      <div className="flex-1" />
      <Link
        href="/dashboard"
        title="Project settings"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-9 rounded-md text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        )}
      >
        <Settings className="size-[18px] stroke-[1.5]" />
      </Link>
    </nav>
  );
}
