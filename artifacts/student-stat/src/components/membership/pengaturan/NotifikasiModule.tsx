import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logoRextra from "@/assets/logo-rextra.png";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Eye, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { NotificationSettings, InvoiceSettings } from "@/hooks/useMembershipSettings";

const TRIGGERS = [
  { value: "D7", label: "H-7 (7 hari sebelum)" },
  { value: "D3", label: "H-3 (3 hari sebelum)" },
  { value: "D1", label: "H-1 (1 hari sebelum)" },
];

const VARIABLES = [
  "{nama_depan}",
  "{tanggal_berakhir}",
  "{nama_plan}",
  "{sisa_hari}",
];

interface Props {
  data: NotificationSettings | null;
  invoice: InvoiceSettings | null;
  loading: boolean;
  saving: boolean;
  onSave: (data: Partial<NotificationSettings>) => Promise<void>;
  onSaveInvoice: (data: Partial<InvoiceSettings>) => Promise<void>;
}

export function NotifikasiModule({ data, invoice, loading, saving, onSave, onSaveInvoice }: Props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emailFooter, setEmailFooter] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setIsEnabled(data.is_enabled);
      setTriggers(data.triggers || []);
      setSubject(data.email_subject_template || "");
      setBody(data.email_body_template || "");
      setDirty(false);
    }
  }, [data]);

  useEffect(() => {
    if (invoice) {
      setEmailFooter(invoice.email_footer_text || "© 2026 Rextra Technology · Email dikirim otomatis");
    }
  }, [invoice]);

  const toggleTrigger = (val: string) => {
    setTriggers(prev => prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val]);
    setDirty(true);
  };

  const canSave = () => {
    if (!isEnabled) return true;
    return triggers.length > 0 && subject.trim() !== "" && body.trim() !== "";
  };

  const handleSave = async () => {
    await onSave({
      is_enabled: isEnabled,
      triggers,
      email_subject_template: subject,
      email_body_template: body,
    });
    await onSaveInvoice({ email_footer_text: emailFooter });
    setDirty(false);
  };

  const renderPreviewBody = () => {
    return body
      .replace("{nama_depan}", "Maya")
      .replace("{tanggal_berakhir}", "20 September 2026")
      .replace("{nama_plan}", "Pro")
      .replace("{sisa_hari}", "7");
  };

  const renderPreviewSubject = () => {
    return subject
      .replace("{nama_depan}", "Maya")
      .replace("{tanggal_berakhir}", "20 September 2026")
      .replace("{nama_plan}", "Pro")
      .replace("{sisa_hari}", "7");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifikasi Pengingat Expired</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Kirim email pengingat sebelum membership berakhir
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{isEnabled ? "Aktif" : "Nonaktif"}</span>
              <Switch
                checked={isEnabled}
                onCheckedChange={(v) => { setIsEnabled(v); setDirty(true); }}
              />
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Jadwal Pengiriman */}
            <div className={!isEnabled ? "opacity-50 pointer-events-none" : ""}>
              <h4 className="text-sm font-semibold mb-3">Jadwal Pengiriman</h4>
              <div className="space-y-3">
                {TRIGGERS.map(t => (
                  <label key={t.value} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={triggers.includes(t.value)}
                      onCheckedChange={() => toggleTrigger(t.value)}
                    />
                    <span className="text-sm">{t.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span>Email dikirim sekali per trigger per siklus langganan.</span>
              </div>
            </div>

            {/* Right: Template Email */}
            <div className={!isEnabled ? "opacity-50 pointer-events-none" : ""}>
              <h4 className="text-sm font-semibold mb-3">Template Email</h4>
              <div className="mb-3">
                <Label className="text-xs text-muted-foreground mb-1.5 block">Variable tersedia</Label>
                <div className="flex flex-wrap gap-1.5">
                  {VARIABLES.map(v => (
                    <Badge key={v} variant="secondary" className="font-mono text-xs cursor-pointer hover:bg-primary/10"
                      onClick={() => { navigator.clipboard.writeText(v); }}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); setDirty(true); }}
                    placeholder="Contoh: Membership kamu akan berakhir {sisa_hari} hari lagi"
                  />
                </div>
                <div>
                  <Label className="text-xs">Body</Label>
                  <Textarea
                    value={body}
                    onChange={(e) => { setBody(e.target.value); setDirty(true); }}
                    rows={5}
                    placeholder="Halo {nama_depan}, ..."
                  />
                </div>
                <div>
                  <Label className="text-xs">Footer Email</Label>
                  <Input
                    value={emailFooter}
                    onChange={(e) => { setEmailFooter(e.target.value); setDirty(true); }}
                    placeholder="© 2026 Rextra Technology · Email dikirim otomatis"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          {dirty && (
            <span className="text-xs text-amber-600">● Ada perubahan belum disimpan</span>
          )}
        </div>
        <div className="flex gap-2">
          {dirty && (
            <Button variant="outline" size="sm" onClick={() => {
              if (data) {
                setIsEnabled(data.is_enabled);
                setTriggers(data.triggers || []);
                setSubject(data.email_subject_template || "");
                setBody(data.email_body_template || "");
                setDirty(false);
              }
              if (invoice) {
                setEmailFooter(invoice.email_footer_text || "");
              }
            }}>
              Batalkan
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving || !canSave() || !dirty}>
            {saving ? "Menyimpan..." : "Simpan Notifikasi"}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[480px] p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-sm">Preview Email</DialogTitle>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">Subject:</span>
              <span className="truncate">{renderPreviewSubject()}</span>
            </div>
          </DialogHeader>
          <div className="bg-slate-50 px-4 pb-4">
            <div className="mx-auto bg-white rounded shadow-sm overflow-hidden border border-slate-200" style={{ maxWidth: 420, fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
              {/* Top bar */}
              <div className="h-1 bg-primary" />

              {/* Header */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
                <img src={logoRextra.src} alt="Rextra" className="h-5 object-contain" />
                <span className="text-[9px] text-slate-400 font-medium tracking-wide uppercase">Membership</span>
              </div>

              {/* Body */}
              <div className="px-5 py-3">
                <p className="text-[11px] text-slate-600 mb-2">
                  Halo, <span className="font-semibold text-slate-800">Maya</span>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap mb-3">
                  {renderPreviewBody()}
                </p>

                <div className="text-center my-3">
                  <a className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded text-[11px] font-semibold no-underline" style={{ letterSpacing: '0.02em' }}>
                    Perpanjang Membership
                  </a>
                </div>

              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-5 py-2.5 text-center">
                <p className="text-[8px] text-slate-400 leading-relaxed">
                  {emailFooter || `© ${new Date().getFullYear()} Rextra Technology · Email dikirim otomatis`}
                </p>
                <p className="text-[7px] text-slate-300 mt-0.5">
                  Jika Anda tidak merasa mendaftar, abaikan email ini.
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 pb-3">
            <p className="text-[10px] text-muted-foreground">
              * Contoh data: Maya, plan Pro, berakhir 20 September 2026 (7 hari lagi).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
