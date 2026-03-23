import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Info, Plus, X } from "lucide-react";
import logoRextra from "@/assets/logo-rextra.png";
import type { InvoiceSettings, TransactionIdSettings } from "@/hooks/useMembershipSettings";

interface Props {
  invoice: InvoiceSettings | null;
  transactionId: TransactionIdSettings | null;
  loading: boolean;
  saving: boolean;
  onSaveInvoice: (data: Partial<InvoiceSettings>) => Promise<void>;
  onSaveTransactionId: (data: Partial<TransactionIdSettings>) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}

export function DokumenPenomoranModule({
  invoice, transactionId, loading, saving,
  onSaveInvoice, onSaveTransactionId, onResetDefaults,
}: Props) {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [footerText, setFooterText] = useState("");
  const [dueDays, setDueDays] = useState(0);
  const [notesList, setNotesList] = useState<string[]>([]);
  const [invPrefix, setInvPrefix] = useState("INV");
  const [resetRule, setResetRule] = useState("MONTHLY");
  const [termsContent, setTermsContent] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState("FAKTUR");

  const [trxPrefix, setTrxPrefix] = useState("TRX");
  const [trxPattern, setTrxPattern] = useState("DATE_DAILY");

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (invoice) {
      setCompanyName(invoice.company_name || "");
      setCompanyAddress(invoice.company_address || "");
      setFooterText(invoice.footer_text || "");
      setDueDays(invoice.default_due_days || 0);
      setNotesList(invoice.notes || []);
      setInvPrefix(invoice.invoice_prefix || "INV");
      setResetRule(invoice.invoice_reset_rule || "MONTHLY");
      setTermsContent(invoice.terms_content || "");
      setInvoiceTitle(invoice.invoice_title || "FAKTUR");
      setDirty(false);
    }
  }, [invoice]);

  useEffect(() => {
    if (transactionId) {
      setTrxPrefix(transactionId.trx_prefix || "TRX");
      setTrxPattern(transactionId.trx_pattern || "DATE_DAILY");
    }
  }, [transactionId]);

  const markDirty = () => setDirty(true);

  const now = new Date();
  const pad = (n: number, len: number) => String(n).padStart(len, "0");

  const invoicePreview = useMemo(() => {
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1, 2);
    const seq = "000001";
    if (resetRule === "MONTHLY") return `${invPrefix}-${y}${m}-${seq}`;
    if (resetRule === "YEARLY") return `${invPrefix}-${y}-${seq}`;
    return `${invPrefix}-${seq}`;
  }, [invPrefix, resetRule]);

  const trxPreview = useMemo(() => {
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1, 2);
    const d = pad(now.getDate(), 2);
    const seq = "005520";
    if (trxPattern === "DATE_DAILY") return `${trxPrefix}-${y}${m}${d}-${seq}`;
    if (trxPattern === "DATE_MONTHLY") return `${trxPrefix}-${y}${m}-${seq}`;
    return `${trxPrefix}-${seq}`;
  }, [trxPrefix, trxPattern]);

  const handleSaveAll = async () => {
    await onSaveInvoice({
      company_name: companyName,
      company_address: companyAddress,
      footer_text: footerText,
      default_due_days: dueDays,
      notes: notesList.filter(n => n.trim()),
      invoice_prefix: invPrefix.toUpperCase(),
      invoice_reset_rule: resetRule,
      terms_content: termsContent,
      invoice_title: invoiceTitle,
    });
    await onSaveTransactionId({
      trx_prefix: trxPrefix.toUpperCase(),
      trx_pattern: trxPattern,
    });
    setDirty(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const dateStr = `${pad(now.getDate(), 2)} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const timestampStr = `${pad(now.getDate(), 2)} ${months[now.getMonth()]} ${now.getFullYear()}, ${pad(now.getHours(), 2)}.${pad(now.getMinutes(), 2)} WIB`;

  // QR code URL
  const fakturUrl = `https://student-stat-stream.lovable.app/faktur/view/sample-id`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(fakturUrl)}`;

  // A4 aspect ratio: 210mm x 297mm ≈ 0.707
  // margin 2.54cm on A4 (210mm) = ~12.1% each side → px approximation in preview
  const A4_MARGIN = "24px"; // scaled 2.54cm equivalent in preview

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Settings (2/3) */}
        <div className="xl:col-span-2 space-y-5">
          {/* A) Identitas Dokumen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Identitas Dokumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Nama Perusahaan</Label>
                  <Input value={companyName} onChange={e => { setCompanyName(e.target.value); markDirty(); }} />
                </div>
                <div>
                  <Label className="text-xs">Default Jatuh Tempo (hari)</Label>
                  <Input type="number" min={0} value={dueDays} onChange={e => { setDueDays(Number(e.target.value)); markDirty(); }} />
                  <p className="text-xs text-muted-foreground mt-1">0 = sama dengan tanggal invoice</p>
                </div>
              </div>
              <div>
                <Label className="text-xs">Alamat Perusahaan</Label>
                <Input value={companyAddress} onChange={e => { setCompanyAddress(e.target.value); markDirty(); }} placeholder="Jl. Contoh No. 123, Jakarta" />
              </div>
              <div>
                <Label className="text-xs">Judul Dokumen</Label>
                <Input value={invoiceTitle} onChange={e => { setInvoiceTitle(e.target.value); markDirty(); }} placeholder="FAKTUR" />
                <p className="text-xs text-muted-foreground mt-1">Misal: FAKTUR, INVOICE, KWITANSI</p>
              </div>
              <div>
                <Label className="text-xs">Footer Text</Label>
                <Input value={footerText} onChange={e => { setFooterText(e.target.value); markDirty(); }} placeholder="Dokumen ini dibuat secara otomatis oleh sistem." />
              </div>
            </CardContent>
          </Card>

          {/* B) Penomoran Invoice */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Penomoran Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Prefix</Label>
                  <Input value={invPrefix} onChange={e => { setInvPrefix(e.target.value); markDirty(); }} placeholder="INV" />
                </div>
                <div>
                  <Label className="text-xs">Reset Sequence</Label>
                  <Select value={resetRule} onValueChange={v => { setResetRule(v); markDirty(); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Bulanan</SelectItem>
                      <SelectItem value="YEARLY">Tahunan</SelectItem>
                      <SelectItem value="NONE">Tidak reset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Preview Nomor</Label>
                <div className="mt-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono">
                  {invoicePreview}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C) Informasi Tambahan (bullet points) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informasi Tambahan (bullet points)</CardTitle>
              <p className="text-xs text-muted-foreground">Catatan ini tampil di dokumen faktur. Kosongkan jika tidak ingin menampilkan.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {notesList.map((note, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">•</span>
                  <Input
                    value={note}
                    onChange={e => {
                      const updated = [...notesList];
                      updated[idx] = e.target.value;
                      setNotesList(updated);
                      markDirty();
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setNotesList(notesList.filter((_, i) => i !== idx));
                      markDirty();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setNotesList([...notesList, ""]); markDirty(); }}
              >
                <Plus className="h-4 w-4 mr-1" />Tambah Catatan
              </Button>
            </CardContent>
          </Card>

          {/* E) Format ID Transaksi */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Format ID Transaksi (TRX)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Prefix</Label>
                  <Input value={trxPrefix} onChange={e => { setTrxPrefix(e.target.value); markDirty(); }} placeholder="TRX" />
                </div>
                <div>
                  <Label className="text-xs">Pola</Label>
                  <Select value={trxPattern} onValueChange={v => { setTrxPattern(v); markDirty(); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DATE_DAILY">TRX-YYYYMMDD-XXXXXX</SelectItem>
                      <SelectItem value="DATE_MONTHLY">TRX-YYYYMM-XXXXXX</SelectItem>
                      <SelectItem value="GLOBAL_SEQ">TRX-XXXXXX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Preview</Label>
                <div className="mt-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono">
                  {trxPreview}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span>Perubahan format tidak berlaku retroaktif untuk transaksi yang sudah ada.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview Panel — A4 proportioned */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Preview Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* A4 wrapper: aspect ratio 210:297 */}
                <div className="mx-3 mb-3 bg-white shadow-md overflow-hidden border" style={{
                  fontFamily: "'Segoe UI', Tahoma, sans-serif",
                  fontSize: 0,
                  aspectRatio: '210 / 297',
                  borderColor: '#d4d4d4',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* Content area with 2.54cm margin equivalent */}
                  <div style={{ padding: A4_MARGIN, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <img src={logoRextra.src} alt="Logo" className="h-4 object-contain mb-0.5" />
                        <p className="text-[7px] font-bold leading-tight" style={{ color: '#111' }}>{companyName || "REXTRA TECHNOLOGY"}</p>
                        {companyAddress && (
                          <p className="text-[6px] leading-tight mt-px" style={{ color: '#888' }}>{companyAddress}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-extrabold tracking-tight leading-none" style={{ color: '#111' }}>{invoiceTitle || "FAKTUR"}</p>
                        <p className="font-mono font-bold text-primary text-[7px] mt-0.5">#{invoicePreview}</p>
                      </div>
                    </div>

                    <div className="w-full" style={{ borderTop: '1px solid #e0e0e0' }} />

                    {/* Bill to + details */}
                    <div className="flex justify-between gap-2 py-1.5">
                      <div>
                        <p className="text-[5px] uppercase tracking-widest font-bold" style={{ color: '#aaa' }}>Ditagihkan kepada</p>
                        <p className="font-semibold text-[7px] mt-px leading-tight" style={{ color: '#222' }}>Maya Putri</p>
                        <p className="text-[6px] leading-tight" style={{ color: '#999' }}>maya@email.com</p>
                      </div>
                      <div className="text-right text-[6px] space-y-0">
                        <div className="flex justify-end gap-1">
                          <span style={{ color: '#999' }}>Tanggal:</span>
                          <span className="font-medium" style={{ color: '#444' }}>{dateStr}</span>
                        </div>
                        <div className="flex justify-end gap-1">
                          <span style={{ color: '#999' }}>Dibayar:</span>
                          <span className="font-medium" style={{ color: '#444' }}>{dateStr}, 02:30 PM</span>
                        </div>
                        <div className="flex justify-end gap-1">
                          <span style={{ color: '#999' }}>Status:</span>
                          <span className="font-semibold" style={{ color: '#16a34a' }}>LUNAS</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full" style={{ borderTop: '1px solid #e0e0e0' }} />

                    {/* Items table */}
                    <div className="py-1.5">
                      <table className="w-full" style={{ fontSize: '6px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <th className="text-left py-0.5 font-bold w-3" style={{ color: '#777' }}>No</th>
                            <th className="text-left py-0.5 font-bold" style={{ color: '#777' }}>Item</th>
                            <th className="text-center py-0.5 font-bold w-4" style={{ color: '#777' }}>Qty</th>
                            <th className="text-right py-0.5 font-bold" style={{ color: '#777' }}>Harga</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td className="py-1">1</td>
                            <td className="py-1 font-medium" style={{ color: '#333' }}>Pembelian Membership Pro — 3 Bulan</td>
                            <td className="py-1 text-center">1</td>
                            <td className="py-1 text-right">Rp 450.000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Total + QR code row */}
                    <div className="flex items-start justify-between py-1">
                      {/* QR Code - stacked */}
                      <div className="flex flex-col items-center" style={{ width: '50px' }}>
                        <img src={qrUrl} alt="QR" className="w-10 h-10 rounded-sm" style={{ border: '1px solid #e0e0e0' }} />
                        <p className="text-[5px] font-bold mt-0.5 text-center" style={{ color: '#555' }}>Scan untuk verifikasi</p>
                      </div>
                      {/* Totals */}
                      <div className="text-right" style={{ fontSize: '6px' }}>
                        <div className="flex justify-end gap-4">
                          <span className="font-bold" style={{ color: '#555' }}>Subtotal:</span>
                          <span className="w-14 text-right">Rp 450.000</span>
                        </div>
                        <div className="flex justify-end gap-4 font-bold mt-0.5 pt-0.5" style={{ borderTop: '1px solid #e0e0e0', fontSize: '7px' }}>
                          <span>Total:</span>
                          <span className="w-14 text-right text-primary">Rp 450.000</span>
                        </div>
                      </div>
                    </div>

                    {/* Informasi Tambahan */}
                    {(notesList.length > 0 || termsContent.trim()) && (
                      <div className="mt-1" style={{ fontSize: '5px', color: '#666' }}>
                        <p className="font-bold mb-0.5" style={{ color: '#555', fontSize: '6px' }}>Informasi Tambahan</p>
                        <ul style={{ paddingLeft: '8px', lineHeight: '1.5' }}>
                          {notesList.filter(n => n.trim()).map((n, i) => (
                            <li key={i} style={{ listStyleType: 'disc' }}>{n}</li>
                          ))}
                          {termsContent.split("\n").filter(n => n.trim()).map((n, i) => (
                            <li key={`t-${i}`} style={{ listStyleType: 'disc' }}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Spacer to push footer to bottom */}
                    <div className="flex-1" />

                    {/* Footer */}
                    <div style={{ borderTop: '1px solid #1e1e1e' }}>
                      <div className="flex gap-1 pt-1" style={{ fontSize: '5px', color: '#888', lineHeight: '1.4' }}>
                        <div className="flex-1">
                          <p>{footerText || "Dokumen ini dibuat secara otomatis oleh sistem."}</p>
                          <p>Transaksi untuk Pembelian Membership</p>
                        </div>
                        <div className="flex-1 text-right" style={{ color: '#aaa' }}>
                          <p>Dicetak dan dibagikan: {timestampStr}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-xs text-amber-600">● Ada perubahan belum disimpan</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onResetDefaults} disabled={saving}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset ke Default
          </Button>
          {dirty && (
            <Button variant="outline" size="sm" onClick={() => { window.location.reload(); }}>
              Batalkan
            </Button>
          )}
          <Button size="sm" onClick={handleSaveAll} disabled={saving || !dirty}>
            {saving ? "Menyimpan..." : "Simpan Dokumen & Penomoran"}
          </Button>
        </div>
      </div>
    </div>
  );
}
