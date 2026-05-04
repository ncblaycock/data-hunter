import { StudioIconRail } from "@/components/studio/StudioIconRail";
import { StudioTableSidebar } from "@/components/studio/StudioTableSidebar";
import { StudioTopNav } from "@/components/studio/StudioTopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <StudioTopNav />
      <div className="flex min-h-0 flex-1">
        <StudioIconRail />
        <StudioTableSidebar />
        <div className="flex min-w-0 min-h-0 flex-1 flex-col bg-studio-grid">
          {children}
        </div>
      </div>
    </div>
  );
}
