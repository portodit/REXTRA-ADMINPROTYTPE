import { useRouter } from 'next/navigation'
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotifikasiModule } from "@/components/membership/pengaturan/NotifikasiModule";
import { DokumenPenomoranModule } from "@/components/membership/pengaturan/DokumenPenomoranModule";
import { useMembershipSettings } from "@/hooks/useMembershipSettings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const MODULES = [
  { id: "notifikasi", label: "Notifikasi", sublabel: "Pengingat Expired", icon: Bell },
  { id: "dokumen", label: "Dokumen & Penomoran", sublabel: "", icon: FileText },
] as const;

type ModuleId = typeof MODULES[number]["id"];

export default function PengaturanMembershipPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<ModuleId>("notifikasi");
  const [pendingModule, setPendingModule] = useState<ModuleId | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const settings = useMembershipSettings();

  const switchModule = (mod: ModuleId) => {
    // For now, simply switch. Could add dirty-check here in future.
    setActiveModule(mod);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>Membership</span>
          <span>/</span>
          <span className="text-foreground font-medium">Pengaturan</span>
        </div>
        <h1 className="text-xl font-bold">Pengaturan Membership</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pengaturan global untuk notifikasi dan dokumen transaksi membership.
        </p>
      </div>

      {/* 2-column layout */}
      <div className="flex gap-6">
        {/* Left sidebar modules */}
        <div className="w-56 shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-24">
            {MODULES.map(m => (
              <button
                key={m.id}
                onClick={() => switchModule(m.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                  activeModule === m.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <m.icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="truncate">{m.label}</div>
                  {m.sublabel && (
                    <div className="text-xs text-muted-foreground truncate">{m.sublabel}</div>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile module selector */}
        <div className="md:hidden w-full mb-4">
          <div className="flex gap-2">
            {MODULES.map(m => (
              <button
                key={m.id}
                onClick={() => switchModule(m.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                  activeModule === m.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <m.icon className="h-4 w-4" />
                <span className="truncate">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {activeModule === "notifikasi" && (
            <NotifikasiModule
              data={settings.notification}
              invoice={settings.invoice}
              loading={settings.loading}
              saving={settings.saving}
              onSave={settings.saveNotification}
              onSaveInvoice={settings.saveInvoice}
            />
          )}
          {activeModule === "dokumen" && (
            <DokumenPenomoranModule
              invoice={settings.invoice}
              transactionId={settings.transactionId}
              loading={settings.loading}
              saving={settings.saving}
              onSaveInvoice={settings.saveInvoice}
              onSaveTransactionId={settings.saveTransactionId}
              onResetDefaults={settings.resetDocumentDefaults}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
