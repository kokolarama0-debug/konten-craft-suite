import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileNav";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile header + bottom nav */}
      <MobileHeader />
      <MobileBottomNav />

      {/* Main content */}
      <main className="min-h-screen md:ml-64">
        <div className="px-4 py-4 pt-[calc(3.5rem+1rem)] pb-[calc(4rem+1rem)] md:p-8 md:pt-8 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};
