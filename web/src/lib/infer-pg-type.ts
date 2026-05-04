/** Rough SQL-ish type labels for column headers (Supabase-style). */
export function inferPgType(value: unknown, key: string): string {
  const k = key.toLowerCase();
  if (k === "id") return "int4";
  if (k.includes("year") || k.includes("month")) return "int4";
  if (value === null || value === undefined) return "text";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int4" : "float8";
  }
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "date";
    return "text";
  }
  return "text";
}
