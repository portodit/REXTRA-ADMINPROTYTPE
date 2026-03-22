import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { FiturSubFiturTab } from "@/components/membership/fitur-hak-akses/FiturSubFiturTab";
import { HakAksesTab } from "@/components/membership/fitur-hak-akses/HakAksesTab";

export default function MembershipFiturHakAkses() {
  const [activeTab, setActiveTab] = useState<"fitur" | "hak-akses">("fitur");

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Fitur & Hak Akses</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Kelola master fitur, sub fitur, dan hak akses untuk konfigurasi membership.
          </p>
        </div>

        {/* Tab Menu */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 border-b border-border min-w-max">
            <button
              onClick={() => setActiveTab("fitur")}
              className={cn(
                "px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                activeTab === "fitur"
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              Fitur & Sub Fitur
            </button>
            <button
              onClick={() => setActiveTab("hak-akses")}
              className={cn(
                "px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                activeTab === "hak-akses"
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              Hak Akses
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "fitur" && <FiturSubFiturTab />}
        {activeTab === "hak-akses" && <HakAksesTab />}
      </div>
    </DashboardLayout>
  );
}
