import type { Metadata } from "next";
import { Table2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Table Editor · Data Studio",
  description: "Supabase-style table editor",
};

export default function DashboardHomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
      <Table2 className="size-12 text-muted-foreground/35" strokeWidth={1.25} />
      <div className="max-w-sm space-y-1">
        <p className="text-sm font-medium text-foreground">Table Editor</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Select a table in the sidebar to browse rows, filters, and the REST
          endpoint for this SQLite mirror.
        </p>
      </div>
    </div>
  );
}
