import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, RefreshCw, AlertCircle, ExternalLink, FileText,
  Clock, CheckCircle2, Ban, ArrowRight, XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

const formatCurrency = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;

function StatusBadgeLg({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
    BERLANGSUNG: { icon: <Clock className="h-4 w-4" />, bg: "bg-amber-50", text: "text-amber-600", label: "Berlangsung" },
    DIBATALKAN: { icon: <Ban className="h-4 w-4" />, bg: "bg-slate-100", text: "text-slate-600", label: "Dibatalkan" },
    BERHASIL: { icon: <CheckCircle2 className="h-4 w-4" />, bg: "bg-emerald-50", text: "text-emerald-600", label: "Berhasil" },
  };
  const c = config[status] || config.BERLANGSUNG;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${c.bg} ${c.text} border border-current/10`}>
      {c.icon}{c.label}
    </span>
  );
}

function ChangeLabel({ type }: { type: string }) {
  const labels: Record<string, string> = {
    PEMBELIAN_BARU: "Pembelian Baru",
    RENEWAL: "Renewal",
    UPGRADE: "Upgrade",
    DOWNGRADE: "Downgrade",
  };
  return <span>{labels[type] || type}</span>;
}

function CancelReasonLabel({ reason }: { reason: string | null }) {
  if (!reason) return null;
  const labels: Record<string, string> = {
    USER: "Dibatalkan oleh pengguna",
    ADMIN: "Dibatalkan oleh admin",
    SYSTEM_EXPIRED: "Kedaluwarsa otomatis",
  };
  return (
    <span className="text-xs text-muted-foreground italic">{labels[reason] || reason}</span>
  );
}

function getXenditSectionStyle(status: string) {
  switch (status) {
    case "BERHASIL":
      return { bg: "bg-emerald-50/50", border: "border-emerald-200/60", accent: "text-emerald-700" };
    case "DIBATALKAN":
      return { bg: "bg-red-50/50", border: "border-red-200/60", accent: "text-red-700" };
    case "BERLANGSUNG":
      return { bg: "bg-amber-50/50", border: "border-amber-200/60", accent: "text-amber-700" };
    default:
      return { bg: "bg-card", border: "border-border", accent: "text-foreground" };
  }
}

export default function TransaksiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: trx, isLoading, isError, refetch } = useQuery({
    queryKey: ["membership-transaction-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_transactions")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !trx) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-red-50 rounded-full p-4 mb-4"><AlertCircle className="h-8 w-8 text-red-500" /></div>
          <h3 className="text-lg font-semibold mb-2">Gagal memuat data</h3>
          <p className="text-muted-foreground mb-4">Transaksi tidak ditemukan atau terjadi kesalahan.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/membership/riwayat-transaksi")}><ArrowLeft className="h-4 w-4 mr-2" />Kembali</Button>
            <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Coba Lagi</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const createdAt = new Date(trx.created_at);
  const items = (trx.items as any[]) || [];
  const xenditStyle = getXenditSectionStyle(trx.primary_status);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/membership/status">Membership</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/membership/riwayat-transaksi">Riwayat Transaksi</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Detail</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={() => navigate("/membership/riwayat-transaksi")} className="text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />Kembali
        </Button>

        {/* Header — single horizontal line: Title + TRX ID (clickable to copy) + Badge + Date + Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-foreground">Detail Transaksi</h1>
            <button
              onClick={() => handleCopy(trx.transaction_id)}
              className="text-sm font-mono bg-muted px-2.5 py-1 rounded-md border border-border hover:bg-muted/80 transition-colors cursor-pointer"
              title="Klik untuk menyalin"
            >
              {trx.transaction_id}
            </button>
            <StatusBadgeLg status={trx.primary_status} />
            <span className="text-xs text-muted-foreground">
              {format(createdAt, "EEEE, dd MMM yyyy • HH:mm", { locale: idLocale })} WIB
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {trx.primary_status === "BERLANGSUNG" && (
              <>
                <Button variant="destructive" size="sm">
                  <XCircle className="h-4 w-4 mr-2" />Batalkan
                </Button>
                {trx.payment_url && (
                  <Button variant="outline" size="sm" onClick={() => window.open(trx.payment_url!, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />Buka Halaman Pembayaran
                  </Button>
                )}
              </>
            )}
            {trx.primary_status === "BERHASIL" && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/faktur/view/${trx.id}`)}>
                <FileText className="h-4 w-4 mr-2" />Lihat Dokumen Invoice
              </Button>
            )}
          </div>
        </div>

        {/* Informasi User — full width */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Informasi User</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2.5 text-muted-foreground w-[140px]">Nama Pengguna</td>
                <td className="py-2.5 font-medium">{trx.user_name}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground">Alamat Email</td>
                <td className="py-2.5">{trx.user_email}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pembayaran Xendit — full width, status-colored */}
        <div className={`rounded-xl border p-5 space-y-4 ${xenditStyle.bg} ${xenditStyle.border}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${xenditStyle.accent}`}>Pembayaran Xendit</h3>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-white/60" onClick={() => refetch()}>
              <RefreshCw className="h-3 w-3 mr-1" />Refresh
            </Button>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {trx.payment_method && (
                <tr className="border-b border-current/5">
                  <td className="py-2 text-muted-foreground w-[140px]">Metode</td>
                  <td className="py-2 font-medium">{trx.payment_method}</td>
                </tr>
              )}
              {trx.xendit_invoice_id && (
                <tr className="border-b border-current/5">
                  <td className="py-2 text-muted-foreground">Invoice ID</td>
                  <td className="py-2">
                    <code className="text-xs font-mono">{trx.xendit_invoice_id}</code>
                  </td>
                </tr>
              )}
              <tr className="border-b border-current/5">
                <td className="py-2 text-muted-foreground">Status</td>
                <td className={`py-2 font-medium ${xenditStyle.accent}`}>{trx.payment_status_display || trx.payment_status_raw || "—"}</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Jumlah Tagihan</td>
                <td className="py-2 font-bold">{formatCurrency(trx.total)}</td>
              </tr>
            </tbody>
          </table>

          {trx.primary_status === "BERHASIL" && trx.paid_at && (
            <p className="text-xs text-emerald-600 font-medium pt-1">
              Dibayar pada {format(new Date(trx.paid_at), "dd MMM yyyy, HH:mm", { locale: idLocale })} WIB
            </p>
          )}
          {trx.primary_status === "DIBATALKAN" && (
            <div className="space-y-1 pt-1 border-t border-red-200/40">
              <CancelReasonLabel reason={trx.cancel_reason} />
              {trx.expires_at && (
                <p className="text-xs text-muted-foreground">
                  Invoice kedaluwarsa pada: {format(new Date(trx.expires_at), "dd MMM yyyy, HH:mm", { locale: idLocale })} WIB
                </p>
              )}
              <p className="text-[11px] text-muted-foreground/70 italic">
                Invoice Xendit mungkin masih aktif sampai kedaluwarsa. Jika pembayaran tetap dilakukan, admin akan menerima notifikasi untuk ditindaklanjuti.
              </p>
            </div>
          )}
        </div>

        {/* Kategori & Nilai — 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategori & Perubahan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground">Status Utama</p>
                <div className="mt-1"><StatusBadgeLg status={trx.primary_status} /></div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Jenis Perubahan</p>
                <p className="text-sm font-medium mt-1"><ChangeLabel type={trx.change_type} /></p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Perubahan Plan</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm">{trx.from_plan || "—"}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{trx.to_plan}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Durasi</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm">{trx.from_duration_months ? `${trx.from_duration_months} bln` : "—"}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{trx.to_duration_months ? `${trx.to_duration_months} bln` : "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nilai Transaksi */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nilai Transaksi</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(trx.subtotal)}</span>
              </div>
              {trx.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Diskon{trx.promo_code ? ` (${trx.promo_code})` : ""}</span>
                  <span>-{formatCurrency(trx.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Bayar</span>
                <span className="text-lg font-bold">{formatCurrency(trx.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Item Pesanan — full width */}
        {items.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Daftar Item Pesanan</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center justify-between border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.plan} — {item.duration_months} bulan</p>
                    <p className="text-xs text-muted-foreground">Membership</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatCurrency(item.base_price)}</p>
                    {item.discount > 0 && (
                      <p className="text-xs text-emerald-600">-{formatCurrency(item.discount)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
