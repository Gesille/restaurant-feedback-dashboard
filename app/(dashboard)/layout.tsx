import { Sidebar } from "@/components/layout/Sidebar";
import { SearchProvider } from "@/lib/search-context";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ModalProvider } from "@/lib/modal-context";
import { NewRestaurantModal } from "@/components/dashboard/restaurants/NewRestaurantModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <ModalProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">{children}</div>
        </div>
        <NewRestaurantModal />
        <CommandPalette />
      </ModalProvider>
    </SearchProvider>
  );
}