import { useRouter, useParams } from 'next/navigation'
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, X, Play, Power, Save, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { useMembershipDetail } from "@/components/membership/detail/useMembershipDetail";
import { DetailHeader } from "@/components/membership/detail/DetailHeader";
import { DurationPanel } from "@/components/membership/detail/DurationPanel";
import { AccessConfigTab } from "@/components/membership/detail/AccessConfigTab";
import { PricingTokenTab } from "@/components/membership/detail/PricingTokenTab";
import { RewardPointsTab } from "@/components/membership/detail/RewardPointsTab";
import { SaveChangesModal, DeactivateModal, ActivateModal } from "@/components/membership/status/MembershipStatusModals";

type TabKey = "akses" | "pembiayaan" | "poin";

const PAID_TABS: { key: TabKey; label: string }[] = [
  { key: "akses", label: "Konfigurasi Akses" },
  { key: "pembiayaan", label: "Pembiayaan & Token" },
  { key: "poin", label: "Reward Poin" },
];

export default function MembershipDetailPage() {
  const id = useParams<{ id: string }>()?.id ?? "";
  const router = useRouter();

  const {
    plan, durations, accessMappings, loading, error,
    fetchData, toggleDuration, updatePlan, updateDuration,
    addAccessMapping, updateAccessMapping, deleteAccessMapping,
    copyDurationConfig,
  } = useMembershipDetail(id || "");

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("akses");

  const isPaid = plan?.category === "paid";
  const isStandard = id === "standard";
  const isStarter = id === "starter";
  const isFreeUniversal = isStandard || isStarter; // These plans have universal access config (no per-duration)

  const activeDurations = durations.filter((d) => d.isActive);
  const isComplete = (() => {
    if (isStandard) {
      // Standard: just needs at least one access mapping on its universal duration
      const dur = durations[0];
      return dur ? accessMappings.filter((m) => m.planDurationId === dur.id).length > 0 : false;
    }
    if (isStarter) {
      const dur = durations[0];
      return dur ? accessMappings.filter((m) => m.planDurationId === dur.id).length > 0 : false;
    }
    return activeDurations.length > 0 && activeDurations.every((d) => {
      const hasMappings = accessMappings.filter((m) => m.planDurationId === d.id).length > 0;
      if (isPaid) {
        return d.price > 0 && d.tokenAmount >= 0 && (!d.pointsActive || d.pointsValue > 0) && hasMappings;
      }
      return hasMappings;
    });
  })();

  const handleBack = () => router.push("/membership/status");

  const handleSaveDraft = async () => {
    if (!plan) return;
    await updatePlan({ status: "draft" });
    toast({ title: "Draft berhasil disimpan" });
  };

  const handleSaveChanges = () => {
    if (plan?.status === "aktif") {
      setShowSaveModal(true);
    } else {
      doSaveChanges();
    }
  };

  const doSaveChanges = async () => {
    if (!plan) return;
    await updatePlan({});
    setShowSaveModal(false);
    toast({ title: "Perubahan berhasil disimpan" });
  };

  const handleActivate = () => {
    if (!isComplete) {
      toast({ variant: "destructive", title: "Konfigurasi belum lengkap", description: "Lengkapi konfigurasi akses terlebih dahulu." });
      return;
    }
    setShowActivateModal(true);
  };

  const doActivate = async () => {
    await updatePlan({ status: "aktif" });
    setShowActivateModal(false);
    toast({ title: "Plan berhasil diaktifkan" });
  };

  const handleDeactivate = () => setShowDeactivateModal(true);

  const doDeactivate = async () => {
    await updatePlan({ status: "nonaktif" });
    setShowDeactivateModal(false);
    toast({ title: "Plan berhasil dinonaktifkan" });
  };

  const handleDurationModeChange = async (mode: "tanpa_durasi" | "dengan_durasi" | "starter_durasi") => {
    if (mode === "tanpa_durasi" || mode === "dengan_durasi") {
      await updatePlan({ durationMode: mode });
    }
  };

  const handleStarterDurationChange = async (months: number) => {
    if (months < 1 || months > 24) return;
    const dur = durations[0];
    if (!dur) return;
    // Update the duration_months in plan_durations
    const { error } = await supabase
      .from("plan_durations")
      .update({ duration_months: months })
      .eq("id", dur.id);
    if (!error) {
      fetchData(); // Refresh
      toast({ title: `Durasi trial diubah ke ${months} bulan` });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-0">
          <Skeleton className="h-10 w-96 max-w-full" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !plan) {
    return (
      <DashboardLayout>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Gagal memuat data</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">{error || "Paket tidak ditemukan."}</p>
            <div className="flex gap-2">
              <Button onClick={fetchData} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </Button>
              <Button onClick={handleBack} variant="outline">
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const hasChanges = true;
  // Standard & Starter: only access tab. Paid: all 3 tabs.
  const tabs = isPaid ? PAID_TABS : [PAID_TABS[0]];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DetailHeader
          plan={plan}
          isComplete={isComplete}
          hasChanges={hasChanges}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          onSaveChanges={handleSaveChanges}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
        />

        {/* Duration Panel — hidden for Standard (info shown inline), shown for Starter and Paid */}
        <DurationPanel
          durations={durations}
          isPaid={isPaid}
          planId={plan.id}
          durationMode={plan.durationMode}
          accessMappings={accessMappings}
          onToggleDuration={toggleDuration}
          onDurationModeChange={handleDurationModeChange}
          onStarterDurationChange={handleStarterDurationChange}
          onCopyConfig={copyDurationConfig}
        />

        {/* Tab Bar */}
        <div className="space-y-5">
          {tabs.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border",
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* For single-tab plans (Standard/Starter), show a section title instead */}
          {tabs.length === 1 && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h2 className="text-base font-semibold text-foreground">Konfigurasi Akses</h2>
            </div>
          )}

          {/* Tab Content */}
          <div>
            {(activeTab === "akses" || tabs.length === 1) && (
              <AccessConfigTab
                durations={durations}
                accessMappings={accessMappings}
                durationMode={isFreeUniversal ? "tanpa_durasi" : plan.durationMode}
                isPaid={isPaid}
                onAddMapping={addAccessMapping}
                onUpdateMapping={updateAccessMapping}
                onDeleteMapping={deleteAccessMapping}
                onCopyConfig={copyDurationConfig}
              />
            )}
            {activeTab === "pembiayaan" && isPaid && (
              <PricingTokenTab
                plan={plan}
                durations={durations}
                onUpdateDuration={updateDuration}
                onUpdatePlan={updatePlan}
              />
            )}
            {activeTab === "poin" && isPaid && (
              <RewardPointsTab
                durations={durations}
                onUpdateDuration={updateDuration}
              />
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="lg"
                className={cn(
                  "rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all",
                  plan.status === "aktif" && "bg-success hover:bg-success/90",
                  plan.status === "draft" && "bg-muted-foreground hover:bg-muted-foreground/90",
                  plan.status === "nonaktif" && "bg-destructive hover:bg-destructive/90",
                )}
              >
                <ChevronUp className="h-5 w-5 text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-56 p-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Status: <span className={cn(
                    "font-semibold",
                    plan.status === "aktif" && "text-success",
                    plan.status === "draft" && "text-muted-foreground",
                    plan.status === "nonaktif" && "text-destructive",
                  )}>{plan.status === "aktif" ? "Aktif" : plan.status === "draft" ? "Draft" : "Nonaktif"}</span>
                </p>
                <div className="h-px bg-border my-1" />

                {plan.status === "draft" && (
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4" /> Simpan Draft
                  </Button>
                )}
                {(plan.status === "draft" || plan.status === "nonaktif") && (
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm text-success hover:text-success" onClick={handleActivate}>
                    <Play className="h-4 w-4" /> Aktifkan Paket
                  </Button>
                )}
                {plan.status === "aktif" && (
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" onClick={handleSaveChanges}>
                      <Save className="h-4 w-4" /> Simpan Perubahan
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive" onClick={handleDeactivate}>
                      <Power className="h-4 w-4" /> Nonaktifkan
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Modals */}
      <SaveChangesModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={doSaveChanges}
        changes={[]}
      />
      <DeactivateModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={doDeactivate}
        activeUsers={plan.activeUsers}
      />
      <ActivateModal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onConfirm={doActivate}
        isComplete={isComplete}
      />
    </DashboardLayout>
  );
}
