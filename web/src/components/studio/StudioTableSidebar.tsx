"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import { TABLES } from "@/config/tables";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function StudioTableSidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const activeSlug =
    pathname.startsWith("/dashboard/") && pathname !== "/dashboard"
      ? pathname.slice("/dashboard/".length)
      : "";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TABLES;
    return TABLES.filter(
      (t) =>
        t.sqlName.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-border bg-studio-side">
      <div className="px-3 py-2">
        <h2 className="text-[13px] font-medium text-foreground">
          Table Editor
        </h2>
      </div>
      <Separator />
      <div className="flex flex-col gap-2 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 w-full justify-between gap-2 border-border/60 bg-muted/10 px-2 font-normal shadow-none",
            )}
          >
            <span className="font-mono text-xs">public</span>
            <ChevronDown className="size-3.5 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem>
              <span className="font-mono text-xs">public</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-full gap-1.5 border-dashed border-border/70 text-xs shadow-none"
          disabled
        >
          <Plus className="size-3.5 opacity-80" />
          New table
        </Button>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tables..."
          className="h-8 border-border/50 bg-muted/15 text-xs"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-3">
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tables
        </p>
        <ul className="space-y-0.5">
          {filtered.map((t) => {
            const active = activeSlug === t.slug;
            return (
              <li key={t.slug}>
                <Link
                  href={`/dashboard/${t.slug}`}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/40",
                    active &&
                      "bg-accent/90 text-accent-foreground ring-1 ring-border/60",
                  )}
                >
                  <span className="flex items-start justify-between gap-1">
                    <span className="truncate font-mono text-[11px] leading-tight text-foreground">
                      {t.sqlName}
                    </span>
                    {t.unrestricted && (
                      <Badge
                        variant="outline"
                        className="h-4 shrink-0 border-rose-500/45 bg-rose-500/10 px-1 py-0 text-[8px] font-bold leading-none tracking-wide text-rose-200"
                      >
                        UNRESTRICTED
                      </Badge>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
