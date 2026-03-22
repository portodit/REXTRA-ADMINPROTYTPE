import { useState, createContext, useContext } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Desktop Sidebar */}
        <AppSidebar
          className="fixed left-0 top-0 z-50 hidden lg:flex"
          isCollapsed={isCollapsed}
          onCollapsedChange={setIsCollapsed}
        />

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 z-50 lg:hidden transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AppSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 transition-all duration-300 overflow-x-hidden min-w-0",
            isCollapsed ? "lg:ml-[80px]" : "lg:ml-[300px]"
          )}
        >
          <TopNavbar
            className="sticky top-0 z-30"
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
