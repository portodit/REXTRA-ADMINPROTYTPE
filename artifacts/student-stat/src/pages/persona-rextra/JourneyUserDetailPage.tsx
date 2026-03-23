import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonaBadge, StatusBadge } from "@/components/persona-rextra/PersonaBadge";
import { personaApi, type UserJourneyDetail } from "@/lib/api";
import {
  ArrowLeft, User, Award, CalendarDays, CheckCircle2, Circle, Clock,
  ChevronRight, Zap, AlertTriangle, RefreshCw
} from "lucide-react";

const MISSION_STATUS_ICON: Record<string, React.ReactNode> = {
  "COMPLETED": <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />,
  "AUTO_PASSED": <Zap className="h-3.5 w-3.5 text-amber-600" />,
  "IN_PROGRESS": <Clock className="h-3.5 w-3.5 text-blue-600" />,
  "NOT_STARTED": <Circle className="h-3.5 w-3.5 text-muted-foreground" />,
};

const MISSION_STATUS_LABEL: Record<string, string> = {
  "COMPLETED": "Selesai",
  "AUTO_PASSED": "Auto-pass",
  "IN_PROGRESS": "Sedang Berjalan",
  "NOT_STARTED": "Belum Mulai",
};

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function JourneyUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<UserJourneyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await personaApi.getUserJourney(userId);
      setData(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data";
      setError(msg.includes("404") ? "User tidak memiliki journey" : "Gagal memuat data journey");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [userId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="space-y-1.5"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-24" /></div>
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/persona-rextra")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="rounded-lg bg-red-50 border border-red-200 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">{error ?? "Terjadi kesalahan"}</p>
                <Button variant="outline" size="sm" className="mt-3 border-red-300 text-red-700" onClick={fetchData}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const progressPct = data.required_total > 0 ? (data.required_completed / data.required_total) * 100 : 0;
  const initials = data.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const totalMisiSelesai = data.missions.filter(m => m.status === "COMPLETED" || m.status === "AUTO_PASSED").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate("/persona-rextra")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">{data.name}</h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <PersonaBadge label={data.active_persona} />
                <StatusBadge label={data.journey_status === "ACTIVE" ? "Sedang Berjalan" : "Journey Selesai"} />
              </div>
            </div>
          </div>
        </div>

        {/* Combined: Info Pengguna + Progress Journey */}
        <Card className="shadow-none">
          {/* Top: Info Pengguna */}
          <div className="p-5 border-b">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-5">
              <User className="h-3.5 w-3.5" /> Informasi Pengguna
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
              <InfoItem label="Persona Awal">
                <PersonaBadge label={data.initial_persona} />
              </InfoItem>
              <InfoItem label="Persona Aktif">
                <PersonaBadge label={data.active_persona} />
              </InfoItem>
              <InfoItem label="Tanggal Profiling">
                <span className="text-sm font-semibold text-foreground">{fmtDate(data.profiled_at)}</span>
              </InfoItem>
              <InfoItem label="Terakhir Diperbarui">
                <span className="text-sm font-semibold text-foreground">{fmtDate(data.last_updated_at)}</span>
              </InfoItem>
            </div>
          </div>

          {/* Bottom: Progress Journey */}
          <div className="p-5 space-y-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" /> Progress Journey
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Misi Wajib Selesai" value={`${data.required_completed} / ${data.required_total}`} accent />
              <MiniStat label="Total Misi Selesai" value={`${totalMisiSelesai} misi`} />
              <MiniStat label="Dianjurkan Selesai" value={`${data.recommended_completed} misi`} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress misi wajib fase aktif</span>
                <span className="font-mono font-semibold">{Math.round(progressPct)}%</span>
              </div>
              <Progress value={progressPct} className="h-2.5" />
            </div>

            {/* Riwayat Transisi */}
            {data.transitions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <CalendarDays className="h-3.5 w-3.5" /> Riwayat Transisi
                </h4>
                <div className="flex items-center gap-2">
                  {data.transitions.map((t, i) => {
                    const isFirst = i === 0 && !t.from_phase_name;
                    const status = i === data.transitions.length - 1 && data.journey_status === "ACTIVE" ? "Aktif" : "Selesai";
                    return (
                      <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`flex-1 flex items-center gap-3 rounded-lg border px-4 py-3 ${status === "Selesai" ? "bg-green-50 border-green-200" : "bg-primary/5 border-primary/30"}`}>
                          <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${status === "Selesai" ? "bg-green-500" : "bg-primary"}`} />
                          <div className="min-w-0">
                            <PersonaBadge label={t.to_phase_name} className="text-xs" />
                            <p className="text-[11px] text-muted-foreground mt-1">
                              {fmtDate(t.transitioned_at)}
                            </p>
                          </div>
                        </div>
                        {i < data.transitions.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Missions Table */}
        {data.missions.length > 0 && (
          <Card className="shadow-none overflow-hidden">
            <div className="p-5 pb-3 border-b">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Daftar Misi User
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Misi</TableHead>
                  <TableHead>Persona</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Selesai</TableHead>
                  <TableHead>Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.missions.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {MISSION_STATUS_ICON[m.status] ?? <Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-sm">{m.title}</span>
                      </div>
                    </TableCell>
                    <TableCell><PersonaBadge label={m.phase_name} className="text-[10px] px-1.5" /></TableCell>
                    <TableCell>
                      <StatusBadge label={m.effective_category === "REQUIRED" ? "Wajib" : "Dianjurkan"} className="text-[10px] px-1.5" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={MISSION_STATUS_LABEL[m.status] ?? m.status} className="text-[10px] px-1.5" />
                    </TableCell>
                    <TableCell><span className="text-xs text-muted-foreground">{fmtDate(m.completed_at)}</span></TableCell>
                    <TableCell>
                      <span className={`text-xs ${m.reward_granted > 0 ? "text-green-700 font-medium" : "text-muted-foreground"}`}>
                        {m.reward_granted > 0 ? `+${m.reward_granted} poin` : `${m.reward_expected} poin`}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
      {children}
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3.5 text-center ${accent ? "bg-primary/5 border-primary/20" : "bg-muted/40"}`}>
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
