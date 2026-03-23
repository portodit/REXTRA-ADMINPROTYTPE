import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PersonaBadge, StatusBadge } from "../PersonaBadge";
import { personaApi, type JourneyUserRow, type JourneyStats } from "@/lib/api";
import { Search, Users, Trophy, AlertTriangle, RefreshCw, Eye, Download, Inbox } from "lucide-react";

export function JourneyPenggunaTab() {
  const [search, setSearch] = useState("");
  const [filterPersonaAktif, setFilterPersonaAktif] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [activeStatCard, setActiveStatCard] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState<JourneyStats | null>(null);
  const [users, setUsers] = useState<JourneyUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData] = await Promise.all([
        personaApi.getStats(),
        personaApi.getUsers({
          search: search || undefined,
          persona_active: filterPersonaAktif !== "semua" ? filterPersonaAktif : undefined,
          status: filterStatus !== "semua" ? filterStatus : undefined,
          page: String(page),
          limit: "20",
        }),
      ]);
      setStats(statsData);
      setUsers(usersData.data);
      setTotal(usersData.total);
      setTotalPages(usersData.total_pages);
    } catch (e) {
      setError("Gagal memuat data. Periksa koneksi dan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [search, filterPersonaAktif, filterStatus, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatClick = (key: string) => {
    if (activeStatCard === key) {
      setActiveStatCard(null);
      setFilterPersonaAktif("semua");
      setFilterStatus("semua");
    } else {
      setActiveStatCard(key);
      setFilterPersonaAktif("semua");
      setFilterStatus("semua");
      if (key === "pathfinder") setFilterPersonaAktif("PATHFINDER");
      else if (key === "builder") setFilterPersonaAktif("BUILDER");
      else if (key === "achiever") setFilterPersonaAktif("ACHIEVER");
      else if (key === "selesai") setFilterStatus("COMPLETED");
    }
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterPersonaAktif("semua");
    setFilterStatus("semua");
    setActiveStatCard(null);
    setPage(1);
  };

  const hasActiveFilter = search !== "" || filterPersonaAktif !== "semua" || filterStatus !== "semua";

  // ─── Loading ───
  if (loading && !stats) {
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5"><Skeleton className="h-6 w-52" /><Skeleton className="h-3.5 w-80" /></div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <div className="flex gap-3"><Skeleton className="h-9 flex-1" /><Skeleton className="h-9 w-36" /><Skeleton className="h-9 w-36" /></div>
        <Card className="shadow-none">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </Card>
      </div>
    );
  }

  // ─── Error ───
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Gagal memuat data journey pengguna</p>
            <p className="text-xs text-red-600 mt-1.5">{error}</p>
            <Button variant="outline" size="sm" className="mt-3 border-red-300 text-red-700 hover:bg-red-50" onClick={fetchData}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const s = stats!;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Journey Pengguna</h2>
          <p className="text-xs text-muted-foreground mt-1">Pantau distribusi user per fase dan progress penyelesaian misi tiap pengguna.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />Refresh
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="Total User Aktif" value={s.total_users_with_journey} icon={<Users className="h-4 w-4" />} active={activeStatCard === "total"} onClick={() => handleStatClick("total")} />
        <StatCard label="Pathfinder" value={s.pathfinder_count} active={activeStatCard === "pathfinder"} onClick={() => handleStatClick("pathfinder")} persona="Pathfinder" />
        <StatCard label="Builder" value={s.builder_count} active={activeStatCard === "builder"} onClick={() => handleStatClick("builder")} persona="Builder" />
        <StatCard label="Achiever" value={s.achiever_count} active={activeStatCard === "achiever"} onClick={() => handleStatClick("achiever")} persona="Achiever" />
        <StatCard label="Journey Selesai" value={s.completed_count} icon={<Trophy className="h-4 w-4" />} active={activeStatCard === "selesai"} onClick={() => handleStatClick("selesai")} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="h-9 text-sm pl-9" placeholder="Cari nama pengguna..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={filterPersonaAktif} onValueChange={v => { setFilterPersonaAktif(v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Persona Aktif" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Persona Aktif</SelectItem>
            <SelectItem value="PATHFINDER">Pathfinder</SelectItem>
            <SelectItem value="BUILDER">Builder</SelectItem>
            <SelectItem value="ACHIEVER">Achiever</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Status Journey" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Status Journey</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="COMPLETED">Selesai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilter && (
        <div className="text-xs text-muted-foreground px-1">
          Menampilkan {users.length} dari {total} pengguna.{" "}
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={resetFilters}>Reset filter</Button>
        </div>
      )}

      {/* Table / Empty State */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            {hasActiveFilter ? <Search className="h-8 w-8 text-muted-foreground" /> : <Inbox className="h-8 w-8 text-muted-foreground" />}
          </div>
          <p className="text-sm font-semibold text-foreground">
            {hasActiveFilter ? "Tidak ada pengguna yang sesuai" : "Belum ada data journey pengguna"}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm">
            {hasActiveFilter
              ? "Coba ubah kata kunci pencarian atau reset filter yang sedang digunakan."
              : "Data pengguna akan tampil di sini setelah hasil profiling persona dan snapshot journey berhasil terbentuk."}
          </p>
          {hasActiveFilter && (
            <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>Reset Filter</Button>
          )}
        </div>
      ) : (
        <>
          <Card className="shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pengguna</TableHead>
                  <TableHead>Persona Aktif</TableHead>
                  <TableHead>Status Journey</TableHead>
                  <TableHead>Progress Wajib</TableHead>
                  <TableHead>Misi Selesai</TableHead>
                  <TableHead>Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.user_id} className="cursor-pointer" onClick={() => navigate(`/persona-rextra/journey/${u.user_id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PersonaBadge
                        label={u.active_persona === "Journey Selesai" ? "Achiever" : u.active_persona}
                        className={u.active_persona === "Journey Selesai" ? "!bg-green-100 !text-green-800" : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={u.journey_status === "ACTIVE" ? "Sedang Berjalan" : "Journey Selesai"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={u.required_total > 0 ? (u.required_completed / u.required_total) * 100 : 0} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{u.required_completed}/{u.required_total}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs font-medium">{u.required_completed + (u.required_total - u.required_completed)} misi</span></TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {u.last_updated_at ? new Date(u.last_updated_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs"
                        onClick={e => { e.stopPropagation(); navigate(`/persona-rextra/journey/${u.user_id}`); }}>
                        <Eye className="h-3.5 w-3.5 mr-1" />Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Halaman {page} dari {totalPages} ({total} pengguna)</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const PERSONA_ACCENT: Record<string, string> = {
  Pathfinder: "border-violet-300 bg-violet-50",
  Builder: "border-blue-300 bg-blue-50",
  Achiever: "border-emerald-300 bg-emerald-50",
};

function StatCard({ label, value, icon, active, onClick, persona }: {
  label: string; value: number; icon?: React.ReactNode;
  active: boolean; onClick: () => void; persona?: string;
}) {
  const accent = persona ? PERSONA_ACCENT[persona] : undefined;
  return (
    <button onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all hover:shadow-sm ${active ? "ring-2 ring-primary border-primary" : accent || "border-border bg-card"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {persona && <PersonaBadge label={persona} className="text-[10px] px-1.5 py-0" />}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </button>
  );
}
