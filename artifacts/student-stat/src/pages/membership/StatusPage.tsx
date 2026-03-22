import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Crown, Users, AlertCircle, RefreshCw, PackageOpen } from "lucide-react";

import { MembershipStatusCard, MembershipPackage, PackageStatus, canActivatePlan } from "@/components/membership/status/MembershipStatusCard";
import { ActivateModal, DeactivateModal } from "@/components/membership/status/MembershipStatusModals";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Emblems
import emblemStarter from "@/assets/emblem-starter.png";
import emblemBasic from "@/assets/emblem-basic.png";
import emblemPro from "@/assets/emblem-pro.png";
import emblemMax from "@/assets/emblem-max.png";

export default function MembershipStatusPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickActivatePkg, setQuickActivatePkg] = useState<MembershipPackage | null>(null);
  const [quickDeactivatePkg, setQuickDeactivatePkg] = useState<MembershipPackage | null>(null);
  
  const [durationsByPlan, setDurationsByPlan] = useState<Record<string, any[]>>({});

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    const [plansRes, durationsRes, mappingsRes] = await Promise.all([
      supabase.from("membership_plans").select("*").order("created_at"),
      supabase.from("plan_durations").select("*"),
      supabase.from("duration_access_mappings").select("plan_duration_id"),
    ]);

    if (plansRes.error) {
      setError("Gagal memuat data");
      setLoading(false);
      return;
    }

    // Count mappings per plan_duration_id
    const mappingCounts: Record<string, number> = {};
    if (!mappingsRes.error && mappingsRes.data) {
      mappingsRes.data.forEach((m: any) => {
        mappingCounts[m.plan_duration_id] = (mappingCounts[m.plan_duration_id] || 0) + 1;
      });
    }

    if (plansRes.data) {
      const mapped: MembershipPackage[] = plansRes.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category as "paid" | "unpaid",
        status: p.status as PackageStatus,
        emblem: p.emblem_key === "basic" ? emblemBasic
          : p.emblem_key === "pro" ? emblemPro
          : p.emblem_key === "max" ? emblemMax
          : emblemStarter,
        price: p.base_price_1m || 0,
        tokenPerMonth: p.base_token_1m || 0,
        pointsActive: false,
        pointsValue: null,
        description: p.description || "",
        lastUpdated: p.updated_at || "",
        lastUpdatedBy: p.updated_by || "System",
        activeUsers: p.active_users || 0,
      }));
      setPackages(mapped);
    }
    if (!durationsRes.error && durationsRes.data) {
      const grouped: Record<string, any[]> = {};
      durationsRes.data.forEach((d: any) => {
        const enriched = { ...d, mapping_count: mappingCounts[d.id] || 0 };
        if (!grouped[d.plan_id]) grouped[d.plan_id] = [];
        grouped[d.plan_id].push(enriched);
      });
      setDurationsByPlan(grouped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const freePackages = packages.filter(p => p.category === "unpaid");
  const premiumPackages = packages.filter(p => p.category === "paid");

  const handleSelect = (pkg: MembershipPackage) => {
    navigate(`/membership/status/${pkg.id}`);
  };

  const handleQuickActivate = (pkg: MembershipPackage) => {
    const planDurations = durationsByPlan[pkg.id] || [];
    const isPaid = pkg.category === "paid";

    if (!canActivatePlan(planDurations, isPaid)) {
      toast({ variant: "destructive", title: "Konfigurasi belum lengkap", description: "Minimal 1 durasi harus sudah diset lengkap sebelum bisa diaktifkan." });
      return;
    }
    setQuickActivatePkg(pkg);
  };

  const doQuickActivate = async () => {
    if (!quickActivatePkg) return;
    const { error } = await supabase
      .from("membership_plans")
      .update({ status: "aktif", updated_at: new Date().toISOString(), updated_by: "Admin" })
      .eq("id", quickActivatePkg.id);
    if (!error) {
      setPackages(prev => prev.map(p => p.id === quickActivatePkg.id ? { ...p, status: "aktif" as PackageStatus } : p));
      toast({ title: "Paket berhasil diaktifkan" });
    }
    setQuickActivatePkg(null);
  };

  const doQuickDeactivate = async () => {
    if (!quickDeactivatePkg) return;
    const { error } = await supabase
      .from("membership_plans")
      .update({ status: "nonaktif", updated_at: new Date().toISOString(), updated_by: "Admin" })
      .eq("id", quickDeactivatePkg.id);
    if (!error) {
      setPackages(prev => prev.map(p => p.id === quickDeactivatePkg.id ? { ...p, status: "nonaktif" as PackageStatus } : p));
      toast({ title: "Paket berhasil dinonaktifkan" });
    }
    setQuickDeactivatePkg(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/membership/fitur-hak-akses">Membership</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Status Membership</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Status Membership</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola status membership dan konfigurasi pembiayaan, token, serta reward poin per status.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <Skeleton className="h-52 rounded-2xl" />
                <Skeleton className="h-52 rounded-2xl" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Gagal memuat data</h3>
            <p className="text-sm text-muted-foreground mb-4">Terjadi kesalahan saat memuat paket membership.</p>
            <Button variant="outline" size="sm" className="gap-2" onClick={fetchPlans}>
              <RefreshCw className="h-3.5 w-3.5" />
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && packages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <PackageOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Belum ada paket</h3>
            <p className="text-sm text-muted-foreground">Paket membership belum tersedia.</p>
          </div>
        )}

        {/* Data State */}
        {!loading && !error && packages.length > 0 && (
          <div className="space-y-6">

            {/* Free Tier */}
            {freePackages.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Free Tier</h3>
                    <p className="text-xs text-muted-foreground">{freePackages.length} paket gratis</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {freePackages.map((p) => (
                    <MembershipStatusCard
                      key={p.id}
                      pkg={p}
                      durations={durationsByPlan[p.id] || []}
                      onSelect={() => handleSelect(p)}
                      onActivate={() => handleQuickActivate(p)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Premium Tier */}
            {premiumPackages.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-warning/10">
                    <Crown className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Premium Tier</h3>
                    <p className="text-xs text-muted-foreground">{premiumPackages.length} paket berbayar</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {premiumPackages.map((p) => (
                    <MembershipStatusCard
                      key={p.id}
                      pkg={p}
                      durations={durationsByPlan[p.id] || []}
                      onSelect={() => handleSelect(p)}
                      onActivate={() => handleQuickActivate(p)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activate Modal */}
      <ActivateModal
        isOpen={!!quickActivatePkg}
        onClose={() => setQuickActivatePkg(null)}
        onConfirm={doQuickActivate}
        isComplete={true}
      />
      <DeactivateModal
        isOpen={!!quickDeactivatePkg}
        onClose={() => setQuickDeactivatePkg(null)}
        onConfirm={doQuickDeactivate}
        activeUsers={quickDeactivatePkg?.activeUsers || 0}
      />
    </DashboardLayout>
  );
}
