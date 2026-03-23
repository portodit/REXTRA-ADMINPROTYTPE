import { useRouter, useParams } from 'next/navigation'
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Copy, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { useDiscountDetail, getDisplayStatus, useDiscounts } from "@/hooks/useDiscounts";
import { CreateEditDiscountDrawer } from "@/components/membership/promo-diskon/CreateEditDiscountDrawer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const statusColor: Record<string, string> = {
  Aktif: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Nonaktif: "bg-gray-100 text-gray-600 border-gray-200",
  Kedaluwarsa: "bg-red-100 text-red-600 border-red-200",
  Terjadwal: "bg-blue-100 text-blue-600 border-blue-200",
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);
}

export default function PromoDiskonDetailPage() {
  const id = useParams<{ id: string }>()?.id ?? "";
  const router = useRouter();
  const { toast } = useToast();
  const { discount, redemptions, loading, refetch } = useDiscountDetail(id);
  const { toggleStatus, saveDiscount } = useDiscounts();
  const [editOpen, setEditOpen] = useState(false);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!discount) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-muted-foreground">Diskon tidak ditemukan.</div>
      </DashboardLayout>
    );
  }

  const ds = getDisplayStatus(discount);

  const handleCopy = () => {
    navigator.clipboard.writeText(discount.code);
    toast({ title: "Kode disalin" });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.push("/membership/promo-diskon")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>Membership</span><span>/</span>
          <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/membership/promo-diskon")}>Promo & Diskon</span>
          <span>/</span>
          <span className="text-foreground font-medium">{discount.code}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-wider">{discount.code}</h1>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Badge className={`${statusColor[ds] || "bg-muted"} border text-xs`}>{ds}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-2">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await toggleStatus(discount.id, discount.status);
                refetch();
              }}
              className="gap-2"
            >
              {discount.status === "ACTIVE" ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
              {discount.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Info Diskon</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">{discount.name}</span></div>
            {discount.description && <div className="flex justify-between"><span className="text-muted-foreground">Deskripsi</span><span>{discount.description}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Scope</span><span>{discount.applies_to === "GLOBAL" ? "Global" : discount.applies_to === "MEMBERSHIP" ? "Membership" : "Topup Token"}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target</span>
              <span>{discount.applies_to === "TOKEN_TOPUP" ? "All Topup" : !discount.membership_plan_targets?.length ? "All Plans" : discount.membership_plan_targets.join(", ")}</span>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bisa digabung</span><span>{discount.stackable ? "Ya" : "Tidak"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Prioritas</span><span>{discount.priority}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Aturan Diskon</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Tipe</span><span>{discount.discount_type === "PERCENTAGE" ? "Persentase" : "Potongan Tetap"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Nilai</span><span className="font-semibold">{discount.discount_type === "PERCENTAGE" ? `${discount.value}%` : formatCurrency(discount.value)}</span></div>
            {discount.max_discount_amount && <div className="flex justify-between"><span className="text-muted-foreground">Maks potongan</span><span>{formatCurrency(discount.max_discount_amount)}</span></div>}
            {discount.min_purchase_amount && <div className="flex justify-between"><span className="text-muted-foreground">Min pembelian</span><span>{formatCurrency(discount.min_purchase_amount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Maks penggunaan</span><span>{discount.max_total_redemptions ?? "Unlimited"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Maks per user</span><span>{discount.max_redemptions_per_user ?? "Unlimited"}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Masa berlaku</span>
              <span>
                {discount.starts_at && discount.ends_at
                  ? `${format(new Date(discount.starts_at), "dd MMM yyyy", { locale: localeId })} – ${format(new Date(discount.ends_at), "dd MMM yyyy", { locale: localeId })}`
                  : "Selamanya"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redemption History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Riwayat Pemakaian</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">Diskon</TableHead>
                <TableHead className="text-right">Final</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Belum ada pemakaian.
                  </TableCell>
                </TableRow>
              ) : (
                redemptions.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{format(new Date(r.applied_at), "dd MMM yy HH:mm", { locale: localeId })}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{r.user_name || "-"}</div>
                      <div className="text-xs text-muted-foreground">{r.user_id}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.transaction_id || "-"}</TableCell>
                    <TableCell>{r.plan_snapshot || r.applies_to_type}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(r.subtotal_amount)}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-red-500">-{formatCurrency(r.discount_amount)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(r.final_amount)}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "APPLIED" ? "default" : "destructive"} className="text-xs">
                        {r.status === "APPLIED" ? "Applied" : "Reversed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateEditDiscountDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        discount={discount}
        onSave={async (data, isEdit) => {
          await saveDiscount(data, isEdit);
          refetch();
        }}
      />
    </DashboardLayout>
  );
}
