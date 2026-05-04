import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TABLES } from "@/config/tables";
import { TableBrowser } from "@/components/dashboard/TableBrowser";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TABLES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = TABLES.find((x) => x.slug === slug);
  return {
    title: t ? `${t.label} · Data Studio` : "Table",
  };
}

export default async function DashboardTablePage({ params }: Props) {
  const { slug } = await params;
  const config = TABLES.find((t) => t.slug === slug);
  if (!config) notFound();

  return <TableBrowser config={config} />;
}
