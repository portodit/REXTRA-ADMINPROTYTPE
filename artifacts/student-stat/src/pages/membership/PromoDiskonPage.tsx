import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Eye } from "lucide-react";
import { useDiscounts, getDisplayStatus, type Discount, type DiscountFilters } from "@/hooks/useDiscounts";
import { CreateEditDiscountDrawer } from "@/components/membership/promo-diskon/CreateEditDiscountDrawer";
import { RextraTablePagination } from "@/components/shared/RextraTablePagination";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const statusColor: Record<string, string> = {
  Aktif: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Nonaktif: "bg-gray-100 text-gray-600 border-gray-200",
  Kedaluwarsa: "bg-red-100 text-red-600 border-red-200",
  Terjadwal: "bg-blue-100 text-blue-600 border-blue-200",
};

const scopeLabel: Record<string, string> = {
  GLOBAL: "Global",
  MEMBERSHIP: "Membership",
  TOKEN_TOPUP: "Topup Token",
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);
}

function getTargetSummary(d: Discount) {
  if (d.applies_to === "TOKEN_TOPUP") return "All Topup";
  if (d.applies_to === "GLOBAL") {
    if (!d.membership_plan_targets?.length) return "All Plans + All Topup";
    return d.membership_plan_targets.join(" + ") + " + All Topup";
  }
  if (!d.membership_plan_targets?.length) return "All Plans";
  return d.membership_plan_targets.join(" + ");
}

function getDiscountDisplay(d: Discount) {
  if (d.discount_type === "PERCENTAGE") return `${d.value}%`;
  return formatCurrency(d.value);
}

export default function PromoDiskonPage() {
  const navigate = useNavigate();
  const { discounts, loading, toggleStatus, saveDiscount } = useDiscounts();
  const [filters, setFilters] = useState<DiscountFilters>({
    search: "", status: "all", applies_to: "all", plan: "all", discount_type: "all",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = useMemo(() => {
    return discounts.filter(d => {
      const displayStatus = getDisplayStatus(d);
      if (filters.status !== "all" && displayStatus !== filters.status) return false;
      if (filters.applies_to !== "all" && d.applies_to !== filters.applies_to) return false;
      if (filters.plan !== "all" && d.applies_to === "MEMBERSHIP") {
        if (d.membership_plan_targets && !d.membership_plan_targets.includes(filters.plan)) return false;
      }
      if (filters.discount_type !== "all" && d.discount_type !== filters.discount_type) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!d.code.toLowerCase().includes(q) && !d.name.toLowerCase().includes(q) && !(d.description || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [discounts, filters]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedDiscounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>Membership</span>
          <span>/</span>
          <span className="text-foreground font-medium">Promo & Diskon</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Promo & Diskon</h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola kode diskon untuk membership dan topup token.</p>
          </div>
          <Button onClick={() => { setEditingDiscount(null); setDrawerOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Buat Diskon
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kode, nama diskon, atau deskripsi…"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="pl-9"
          />
        </div>
        <Select value={filters.status} onValueChange={v => setFilters(f => ({ ...f, status: v }))}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Nonaktif">Nonaktif</SelectItem>
            <SelectItem value="Kedaluwarsa">Kedaluwarsa</SelectItem>
            <SelectItem value="Terjadwal">Terjadwal</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.applies_to} onValueChange={v => setFilters(f => ({ ...f, applies_to: v }))}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Scope</SelectItem>
            <SelectItem value="GLOBAL">Global</SelectItem>
            <SelectItem value="MEMBERSHIP">Membership</SelectItem>
            <SelectItem value="TOKEN_TOPUP">Topup Token</SelectItem>
          </SelectContent>
        </Select>
        {filters.applies_to === "MEMBERSHIP" && (
          <Select value={filters.plan} onValueChange={v => setFilters(f => ({ ...f, plan: v }))}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Plan</SelectItem>
              <SelectItem value="BASIC">Basic</SelectItem>
              <SelectItem value="PRO">Pro</SelectItem>
              <SelectItem value="MAX">Max</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select value={filters.discount_type} onValueChange={v => setFilters(f => ({ ...f, discount_type: v }))}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="PERCENTAGE">Persentase</SelectItem>
            <SelectItem value="FIXED">Potongan Tetap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-2xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Tipe + Nilai</TableHead>
              <TableHead>Masa Berlaku</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  Tidak ada diskon ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDiscounts.map(d => {
                const ds = getDisplayStatus(d);
                return (
                  <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/membership/promo-diskon/${d.id}`)}>
                    <TableCell className="font-mono font-semibold text-primary">{d.code}</TableCell>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{scopeLabel[d.applies_to] || d.applies_to}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getTargetSummary(d)}</TableCell>
                    <TableCell className="font-medium">{getDiscountDisplay(d)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {d.starts_at && d.ends_at
                        ? `${format(new Date(d.starts_at), "dd MMM yy", { locale: localeId })} – ${format(new Date(d.ends_at), "dd MMM yy", { locale: localeId })}`
                        : d.starts_at ? `Mulai ${format(new Date(d.starts_at), "dd MMM yy", { locale: localeId })}`
                        : d.ends_at ? `s/d ${format(new Date(d.ends_at), "dd MMM yy", { locale: localeId })}`
                        : "Selamanya"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColor[ds] || "bg-muted"} border text-xs`}>{ds}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); navigate(`/membership/promo-diskon/${d.id}`); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <RextraTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
            itemsPerPageOptions={[10, 25, 50]}
          />
        )}
      </div>

      <CreateEditDiscountDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        discount={editingDiscount}
        onSave={saveDiscount}
      />
    </DashboardLayout>
  );
}
