import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import {
  useUserMembership,
  useSubscriptionCycles,
  useUsageLogs,
  useUserEntitlements,
} from "@/hooks/useUserMembershipDetail";
import { CategoryBadge } from "@/components/membership/riwayat/StatusBadges";
import { UserMembershipTab1 } from "@/components/membership/riwayat/detail/Tab1StatusRiwayat";
import { UserMembershipTab2 } from "@/components/membership/riwayat/detail/Tab2AksesPenggunaan";
import { formatDistanceToNow, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const tierColors: Record<string, { bg: string; text: string; border: string }> = {
  Max: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Pro: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  Basic: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Starter: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Standard: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
};

const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function UserMembershipDetailPage() {
  const userId = useParams<{ userId: string }>()?.userId ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "status";

  const { data: membership, isLoading, isError, refetch } = useUserMembership(userId);
  const cycles = useSubscriptionCycles(userId);
  const usageLogs = useUsageLogs(userId);
  const entitlements = useUserEntitlements(userId, membership?.tier);

  const setTab = (tab: string) => {
    ;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !membership) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-destructive/10 rounded-full p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isError ? "Gagal memuat data" : "User tidak ditemukan"}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {isError
              ? "Terjadi kesalahan saat memuat data membership. Silakan coba lagi."
              : "Data membership untuk user ini tidak ditemukan."}
          </p>
          <div className="flex gap-2">
            {isError && (
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" /> Coba Lagi
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push("/membership/riwayat-langganan")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tc = tierColors[membership.tier] || tierColors.Standard;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/membership/riwayat-langganan")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">
              Membership &gt; Riwayat Langganan &gt; {membership.user_name}
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Detail Membership User</h1>
          </div>
        </div>

        {/* User Profile + Status Membership side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Data Diri */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Data Diri Pengguna</h3>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 rounded-xl">
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg font-bold">
                  {getInitials(membership.user_name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-foreground truncate">{membership.user_name}</h2>
                <p className="text-sm text-muted-foreground truncate">{membership.user_email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bergabung sejak {format(new Date(membership.created_at), "d MMMM yyyy", { locale: idLocale })} ({formatDistanceToNow(new Date(membership.created_at), { locale: idLocale })})
                </p>
              </div>
            </div>
          </div>

          {/* Right: Status Membership Terkini */}
          <div className={`bg-card border rounded-xl p-5 ${tc.border}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status Membership Terkini</h3>
              <CategoryBadge category={membership.category} />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`px-3 py-1.5 rounded-lg ${tc.bg} ${tc.border} border`}>
                <span className={`text-lg font-bold ${tc.text}`}>{membership.tier}</span>
              </div>
              {membership.paid_cycle_count > 0 && (
                <Badge variant="outline" className="text-[10px]">Langganan ke-{membership.paid_cycle_count}</Badge>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${membership.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                {membership.is_active ? "Aktif" : "Tidak aktif"}
              </span>
            </div>
            {membership.start_date && (
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">Mulai</p>
                  <p className="font-medium text-xs">{formatDate(membership.start_date)}</p>
                </div>
                {membership.end_date && (
                  <div className={`p-2 rounded-lg ${!membership.is_active ? "bg-red-50" : membership.remaining_days <= 30 ? "bg-amber-50" : "bg-muted/30"}`}>
                    <p className="text-[10px] text-muted-foreground uppercase">{!membership.is_active ? "Expired" : "Berakhir"}</p>
                    <p className={`font-medium text-xs ${!membership.is_active ? "text-red-600" : membership.remaining_days <= 30 ? "text-amber-600" : ""}`}>
                      {formatDate(membership.end_date)}
                      {membership.is_active && membership.remaining_days > 0 && ` (${membership.remaining_days}h)`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setTab} className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto w-full justify-start">
            <TabsTrigger
              value="status"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Status & Riwayat Langganan
            </TabsTrigger>
            <TabsTrigger
              value="akses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Akses & Penggunaan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="mt-6">
            <UserMembershipTab1
              membership={membership}
              cycles={cycles.data || []}
              isLoading={cycles.isLoading}
              isError={cycles.isError}
              refetch={cycles.refetch}
            />
          </TabsContent>

          <TabsContent value="akses" className="mt-6">
            <UserMembershipTab2
              membership={membership}
              entitlements={entitlements.data || []}
              usageLogs={usageLogs.data || []}
              isLoading={entitlements.isLoading || usageLogs.isLoading}
              isError={entitlements.isError || usageLogs.isError}
              refetch={() => { entitlements.refetch(); usageLogs.refetch(); }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
