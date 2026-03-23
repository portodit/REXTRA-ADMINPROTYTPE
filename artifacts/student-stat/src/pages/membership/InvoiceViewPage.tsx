import { useParams } from 'next/navigation'
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logoRextra from "@/assets/logo-rextra.png";
import { Button } from "@/components/ui/button";
import { Printer, Download, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;
const pad = (n: number, len: number) => String(n).padStart(len, "0");
const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const formatDateId = (d: Date) => `${pad(d.getDate(), 2)} ${months[d.getMonth()]} ${d.getFullYear()}`;
const formatTimestampId = (d: Date) => `${formatDateId(d)}, ${pad(d.getHours(), 2)}.${pad(d.getMinutes(), 2)} WIB`;
const formatTimeAmPm = (d: Date) => {
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h, 2)}:${pad(d.getMinutes(), 2)} ${ampm}`;
};
const formatDateTimeId = (d: Date) => `${formatDateId(d)}, ${formatTimeAmPm(d)}`;

export default function InvoiceViewPage() {
  const id = useParams<{ id: string }>()?.id ?? "";

  const { data: trx, isLoading: trxLoading } = useQuery({
    queryKey: ["invoice-trx", id],
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

  const { data: invoiceSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["invoice-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_settings" as any)
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as any;
    },
  });

  const loading = trxLoading || settingsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-[800px]">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!trx) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Transaksi tidak ditemukan</h2>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />Kembali
          </Button>
        </div>
      </div>
    );
  }

  const companyName = invoiceSettings?.company_name || "REXTRA TECHNOLOGY";
  const companyAddress = invoiceSettings?.company_address || "";
  const footerText = invoiceSettings?.footer_text || "Dokumen ini dibuat secara otomatis oleh sistem.";
  const invoiceTitle = invoiceSettings?.invoice_title || "FAKTUR";
  const items = (trx.items as any[]) || [];
  const createdAt = new Date(trx.created_at);
  const paidAt = trx.paid_at ? new Date(trx.paid_at) : null;
  const now = new Date();

  // Build invoice ID from prefix + transaction_id
  const invoicePrefix = invoiceSettings?.invoice_prefix || 'INV';
  const invoiceId = `${invoicePrefix}-${trx.transaction_id}`;

  const baseUrl = 'https://student-stat-stream.lovable.app';
  const fakturPath = `/faktur/view/${trx.id}`;
  const fakturUrl = `${baseUrl}${fakturPath}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(fakturUrl)}`;
  const notes = (invoiceSettings?.notes as string[]) || [];
  const termsContent = invoiceSettings?.terms_content || '';

  // Build item description based on change_type
  const buildItemDesc = () => {
    const changeType = trx.change_type;
    const toPlan = trx.to_plan;
    const fromPlan = trx.from_plan;
    const duration = trx.to_duration_months;
    const durText = duration ? `${duration} Bulan` : '';

    if (changeType === 'RENEWAL') {
      return `Renewal Membership ${toPlan}${durText ? ` — ${durText}` : ''}`;
    } else if (changeType === 'UPGRADE') {
      return `Upgrade Membership ${fromPlan || ''} ke ${toPlan}${durText ? ` — ${durText}` : ''}`;
    } else if (changeType === 'DOWNGRADE') {
      return `Downgrade Membership ${fromPlan || ''} ke ${toPlan}${durText ? ` — ${durText}` : ''}`;
    }
    return `Pembelian Membership ${toPlan}${durText ? ` — ${durText}` : ''}`;
  };
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar — hidden on print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />Kembali
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />Cetak
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="flex justify-center py-8 print:py-0">
        <div
          className="bg-white shadow-lg print:shadow-none"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '2.54cm',
            fontFamily: "'Segoe UI', Tahoma, sans-serif",
            fontSize: '11px',
            color: '#333',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <img src={logoRextra.src} alt="Logo" className="h-10 object-contain mb-1" />
              <p className="text-sm font-bold" style={{ color: '#111' }}>{companyName}</p>
              {companyAddress && (
                <p className="text-xs" style={{ color: '#888' }}>{companyAddress}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold tracking-tight" style={{ color: '#111' }}>{invoiceTitle}</p>
              <p className="font-mono font-bold text-primary text-sm mt-1">#{invoiceId}</p>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #1e1e1e' }} />

          {/* Bill to + Invoice details */}
          <div className="flex justify-between gap-6 py-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#999' }}>Ditagihkan kepada</p>
              <p className="font-semibold text-sm mt-1" style={{ color: '#111' }}>{trx.user_name}</p>
              <p className="text-xs" style={{ color: '#888' }}>{trx.user_email}</p>
            </div>
            <div className="text-right text-xs space-y-1">
              <div className="flex justify-end gap-3">
                <span style={{ color: '#888' }}>Tanggal:</span>
                <span className="font-medium">{formatDateId(createdAt)}</span>
              </div>
              {paidAt && (
                <div className="flex justify-end gap-3">
                  <span style={{ color: '#888' }}>Dibayar:</span>
                  <span className="font-medium">{formatDateTimeId(paidAt)}</span>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <span style={{ color: '#888' }}>Status:</span>
                <span className="font-semibold" style={{ color: trx.primary_status === 'BERHASIL' ? '#16a34a' : '#888' }}>
                  {trx.primary_status === 'BERHASIL' ? 'LUNAS' : trx.primary_status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e0e0e0' }} />

          {/* Items table */}
          <div className="py-4">
            <table className="w-full" style={{ fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1e1e1e' }}>
                  <th className="text-left py-2 font-bold" style={{ color: '#555', width: '36px' }}>No</th>
                  <th className="text-left py-2 font-bold" style={{ color: '#555' }}>Item</th>
                  <th className="text-center py-2 font-bold" style={{ color: '#555', width: '50px' }}>Qty</th>
                  <th className="text-right py-2 font-bold" style={{ color: '#555', width: '120px' }}>Harga Satuan</th>
                  <th className="text-right py-2 font-bold" style={{ color: '#555', width: '120px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td className="py-3">{idx + 1}</td>
                    <td className="py-3 font-medium">
                      <span>{buildItemDesc()}</span>
                    </td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right">{formatCurrency(item.base_price)}</td>
                    <td className="py-3 text-right">{formatCurrency(item.base_price)}</td>
                  </tr>
                )) : (
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td className="py-3">1</td>
                    <td className="py-3 font-medium">{buildItemDesc()}</td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right">{formatCurrency(trx.subtotal)}</td>
                    <td className="py-3 text-right">{formatCurrency(trx.subtotal)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals + QR */}
          <div className="flex justify-between items-start py-4">
            {/* QR Code - stacked vertically */}
            <div className="flex flex-col items-center" style={{ width: '90px' }}>
              <img src={qrUrl} alt="QR Code" className="w-20 h-20" style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }} />
              <p className="text-[10px] font-bold mt-1.5 text-center" style={{ color: '#555' }}>Scan untuk verifikasi</p>
            </div>

            {/* Totals */}
            <div className="text-right" style={{ minWidth: '240px' }}>
              <div className="flex justify-between text-xs py-1">
                <span className="font-bold" style={{ color: '#555' }}>Subtotal</span>
                <span>{formatCurrency(trx.subtotal)}</span>
              </div>
              {trx.discount > 0 && (
                <div className="flex justify-between text-xs py-1" style={{ color: '#16a34a' }}>
                  <span className="font-bold">Diskon{trx.promo_code ? ` (${trx.promo_code})` : ''}</span>
                  <span>-{formatCurrency(trx.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm py-2 mt-1" style={{ borderTop: '2px solid #1e1e1e' }}>
                <span>Total</span>
                <span>{formatCurrency(trx.total)}</span>
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          {(notes.length > 0 || termsContent) && (
            <div className="py-3" style={{ fontSize: '10px' }}>
              <p className="font-bold mb-1" style={{ color: '#555' }}>Informasi Tambahan</p>
              <ul style={{ color: '#666', paddingLeft: '14px', lineHeight: '1.6' }}>
                {notes.map((note, idx) => (
                  <li key={idx} style={{ listStyleType: 'disc' }}>{note}</li>
                ))}
                {termsContent && termsContent.split('\n').filter(Boolean).map((line: string, idx: number) => (
                  <li key={`t-${idx}`} style={{ listStyleType: 'disc' }}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <div style={{ borderTop: '1px solid #1e1e1e' }}>
            <div className="flex gap-4 pt-3" style={{ fontSize: '9px', color: '#888', lineHeight: '1.5' }}>
              <div className="flex-1">
                <p>{footerText}</p>
                <p>Transaksi untuk Pembelian Membership</p>
              </div>
              <div className="flex-1 text-right" style={{ color: '#aaa' }}>
                <p>Dicetak dan dibagikan: {formatTimestampId(now)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
