import {
  Bell,
  ChevronRight,
  HelpCircle,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StudioTopNav() {
  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-studio-top px-3 text-sm">
      <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
        <span className="truncate hover:text-foreground">Datahunter</span>
        <ChevronRight className="size-3.5 shrink-0 opacity-50" />
        <span className="truncate text-foreground">web</span>
      </div>

      <div className="mx-auto hidden min-w-0 flex-1 items-center justify-center gap-2 sm:flex">
        <Badge
          variant="secondary"
          className="h-5 rounded px-1.5 font-mono text-[10px] font-normal"
        >
          main
        </Badge>
        <Badge
          variant="outline"
          className="h-5 border-amber-500/35 bg-amber-500/10 text-[10px] font-semibold tracking-wide text-amber-200"
        >
          PRODUCTION
        </Badge>
        <Button
          size="sm"
          className="h-7 border-0 bg-brand px-3 font-medium text-brand-foreground shadow-none hover:bg-brand/90"
        >
          Connect
        </Button>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <div className="relative hidden min-w-[200px] md:block lg:min-w-[240px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            placeholder="Search..."
            className="h-7 border-border/50 bg-muted/20 pl-8 pr-14 text-xs"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border/80 bg-background/80 px-1.5 font-mono text-[10px] text-muted-foreground lg:inline">
            Ctrl K
          </kbd>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-8 text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-8 text-muted-foreground"
          aria-label="Help"
        >
          <HelpCircle className="size-4" />
        </Button>
        <Avatar size="sm" className="ring-1 ring-border">
          <AvatarFallback className="bg-muted text-[10px] font-medium">
            DH
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
