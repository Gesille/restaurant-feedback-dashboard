import { Sidebar } from "@/components/layout/Sidebar";
import { SearchProvider } from "@/lib/search-context";
import { CommandPalette } from "@/components/layout/CommandPalette";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
      <CommandPalette />
    </SearchProvider>
  );
}