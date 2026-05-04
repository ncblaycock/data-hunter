"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import type { TableConfig } from "@/config/tables";
import { inferPgType } from "@/lib/infer-pg-type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ListResponse = {
  data: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
};

export function TableBrowser({ config }: { config: TableConfig }) {
  const { apiBase, label, sqlName } = config;
  const [page, setPage] = useState(1);
  const limit = 25;
  const [payload, setPayload] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${apiBase}?page=${page}&limit=${limit}`)
      .then(async (r) => {
        if (!r.ok) {
          const t = await r.text();
          throw new Error(t || r.statusText);
        }
        return r.json() as Promise<ListResponse>;
      })
      .then((body) => {
        if (!cancelled) {
          setPayload(body);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Request failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase, page, limit, refreshKey]);

  const columns = useMemo(() => {
    const row = payload?.data?.[0];
    if (!row) return [] as string[];
    return Object.keys(row);
  }, [payload]);

  const columnMeta = useMemo(() => {
    if (!payload?.data?.[0]) return [] as { name: string; type: string; pk: boolean }[];
    const sample = payload.data[0];
    return columns.map((c) => ({
      name: c,
      type: inferPgType(sample[c], c),
      pk: c === "id",
    }));
  }, [payload, columns]);

  const totalPages = payload
    ? Math.max(1, Math.ceil(payload.total / payload.limit))
    : 1;

  const filteredRows = useMemo(() => {
    if (!payload) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return payload.data;
    return payload.data.filter((row) =>
      Object.values(row).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [payload, filter]);

  function formatCell(value: unknown) {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-studio-grid">
      <div className="flex h-9 items-end gap-2 border-b border-border bg-studio-side/80 px-2">
        <div className="flex h-full items-center border-b-2 border-foreground px-2.5 text-[13px] font-medium text-foreground">
          <span className="font-mono">
            public<span className="text-muted-foreground">.</span>
            {sqlName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border bg-studio-side/50 px-3 py-1.5">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by... or ask AI"
          className="h-8 flex-1 border-border/50 bg-muted/15 text-xs shadow-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-studio-side/30 px-3 py-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 border-border/60 text-xs shadow-none"
          disabled
        >
          Sort
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 border-border/60 text-xs shadow-none"
          disabled
        >
          Add RLS policy
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-7 gap-1 border-border/60 px-2 text-xs shadow-none",
            )}
          >
            Role <ChevronDown className="size-3 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem className="font-mono text-xs">
              postgres
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 border-border/60 text-xs shadow-none"
          disabled
        >
          Index Advisor
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 text-muted-foreground"
          aria-label="Refresh"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
        </Button>

        <div className="ml-auto">
          <Button
            type="button"
            size="sm"
            className="h-7 border-0 bg-brand px-3 font-medium text-brand-foreground shadow-none hover:bg-brand/90"
            disabled
          >
            Insert
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="border-b border-border bg-muted/20 px-3 py-1.5">
          <p className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{label}</span>
            <span className="mx-1.5 text-border">—</span>
            API <code className="rounded bg-muted px-1 font-mono text-[10px] text-brand">{apiBase}</code>
            {payload && (
              <>
                <span className="mx-1.5 text-border">·</span>
                {loading ? (
                  <span className="text-muted-foreground">Refreshing…</span>
                ) : (
                  <span>
                    <span className="text-foreground">{payload.total.toLocaleString()}</span>{" "}
                    rows
                    <span className="mx-1.5 text-border">·</span>
                    page {payload.page} / {totalPages}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {error && (
          <div className="p-3">
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {loading && !payload && (
          <p className="p-4 text-sm text-muted-foreground">Loading rows…</p>
        )}

        {payload && columns.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            No rows in this table yet. Run{" "}
            <code className="rounded bg-muted px-1 text-xs">npm run db:seed</code>.
          </p>
        )}

        {payload && columns.length > 0 && (
          <div
            className={cn(
              "min-w-max",
              loading && "pointer-events-none opacity-60",
            )}
          >
            <Table className="w-max border-collapse text-xs">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="sticky top-0 z-20 w-10 border border-border bg-muted/60 px-1 text-center align-middle">
                    <div className="flex justify-center py-0.5">
                      <Checkbox disabled className="opacity-40" aria-label="Select all" />
                    </div>
                  </TableHead>
                  <TableHead className="sticky top-0 z-20 w-12 border border-border bg-muted/60 px-1 text-center align-middle font-mono text-[10px] font-normal text-muted-foreground">
                    #
                  </TableHead>
                  {columnMeta.map((col) => (
                    <TableHead
                      key={col.name}
                      className="sticky top-0 z-20 min-w-[7rem] border border-border bg-muted/60 px-2 py-1 align-top"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          {col.pk && (
                            <KeyRound className="size-3.5 shrink-0 text-brand" aria-hidden />
                          )}
                          <span className="truncate">{col.name}</span>
                        </div>
                        <span className="font-mono text-[11px] font-normal tracking-tight text-muted-foreground">
                          {col.type}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row, rowIdx) => {
                  const globalIdx = filter.trim()
                    ? rowIdx + 1
                    : (payload.page - 1) * payload.limit + rowIdx + 1;
                  return (
                    <TableRow
                      key={Number(row.id)}
                      className="border-border hover:bg-muted/25"
                    >
                      <TableCell className="border border-border bg-muted/10 p-0">
                        <div className="flex justify-center py-1">
                          <Checkbox
                            disabled
                            className="opacity-60"
                            aria-label={`Select row ${globalIdx}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="border border-border bg-muted/10 px-2 py-1 text-right font-mono text-[11px] text-muted-foreground">
                        {globalIdx}
                      </TableCell>
                      {columns.map((c) => (
                        <TableCell
                          key={c}
                          className="max-w-[18rem] truncate border border-border px-2 py-1 font-mono text-[11px] text-foreground"
                          title={formatCell(row[c])}
                        >
                          {formatCell(row[c])}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {payload && totalPages > 1 && (
        <footer className="flex items-center justify-between gap-2 border-t border-border bg-studio-side/40 px-3 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </footer>
      )}
    </div>
  );
}
