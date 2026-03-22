import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Discount } from "@/hooks/useDiscounts";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: Discount | null;
  onSave: (data: Partial<Discount>, isEdit: boolean) => Promise<void>;
}

const defaultForm = {
  code: "",
  name: "",
  description: "",
  applies_to: "GLOBAL",
  membership_plan_targets: [] as string[],
  discount_type: "PERCENTAGE",
  value: 0,
  max_discount_amount: null as number | null,
  min_purchase_amount: null as number | null,
  max_total_redemptions: null as number | null,
  max_redemptions_per_user: null as number | null,
  stackable: false,
  priority: 100,
  starts_at: "",
  ends_at: "",
  status: "ACTIVE",
};

export function CreateEditDiscountDrawer({ open, onOpenChange, discount, onSave }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const isEdit = !!discount;

  useEffect(() => {
    if (discount) {
      setForm({
        code: discount.code,
        name: discount.name,
        description: discount.description || "",
        applies_to: discount.applies_to,
        membership_plan_targets: discount.membership_plan_targets || [],
        discount_type: discount.discount_type,
        value: discount.value,
        max_discount_amount: discount.max_discount_amount,
        min_purchase_amount: discount.min_purchase_amount,
        max_total_redemptions: discount.max_total_redemptions,
        max_redemptions_per_user: discount.max_redemptions_per_user,
        stackable: discount.stackable,
        priority: discount.priority,
        starts_at: discount.starts_at ? discount.starts_at.slice(0, 16) : "",
        ends_at: discount.ends_at ? discount.ends_at.slice(0, 16) : "",
        status: discount.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [discount, open]);

  const updateField = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const togglePlan = (plan: string) => {
    setForm(f => ({
      ...f,
      membership_plan_targets: f.membership_plan_targets.includes(plan)
        ? f.membership_plan_targets.filter(p => p !== plan)
        : [...f.membership_plan_targets, plan],
    }));
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast({ title: "Kode dan Nama wajib diisi", variant: "destructive" });
      return;
    }
    if (form.discount_type === "PERCENTAGE" && !form.max_discount_amount) {
      toast({ title: "Maks potongan wajib untuk tipe persentase", variant: "destructive" });
      return;
    }
    if (form.value <= 0) {
      toast({ title: "Nilai diskon harus > 0", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        code: form.code.toUpperCase().trim(),
        name: form.name.trim(),
        description: form.description || null,
        applies_to: form.applies_to,
        membership_plan_targets: form.applies_to !== "TOKEN_TOPUP" && form.membership_plan_targets.length > 0 ? form.membership_plan_targets : null,
        topup_targets: null,
        discount_type: form.discount_type,
        value: form.value,
        max_discount_amount: form.discount_type === "PERCENTAGE" ? form.max_discount_amount : null,
        min_purchase_amount: form.min_purchase_amount || null,
        max_total_redemptions: form.max_total_redemptions || null,
        max_redemptions_per_user: form.max_redemptions_per_user || null,
        stackable: form.stackable,
        priority: form.priority,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        status: form.status,
      };
      if (isEdit) payload.id = discount!.id;
      await onSave(payload, isEdit);
      toast({ title: isEdit ? "Diskon diperbarui" : "Diskon dibuat" });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Gagal menyimpan", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Diskon" : "Buat Diskon Baru"}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Identity & Scope */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Identitas & Scope</h3>

            <div className="space-y-2">
              <Label>Kode Diskon *</Label>
              <Input value={form.code} onChange={e => updateField("code", e.target.value.toUpperCase())} placeholder="DISKON10" className="font-mono" />
            </div>

            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Diskon Lebaran" />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={e => updateField("description", e.target.value)} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Scope (applies_to)</Label>
              <Select value={form.applies_to} onValueChange={v => updateField("applies_to", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">Global (Membership + Topup)</SelectItem>
                  <SelectItem value="MEMBERSHIP">Membership saja</SelectItem>
                  <SelectItem value="TOKEN_TOPUP">Topup Token saja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.applies_to !== "TOKEN_TOPUP" && (
              <div className="space-y-2">
                <Label>Target Plan</Label>
                <p className="text-xs text-muted-foreground">Kosongkan = semua plan</p>
                <div className="flex gap-3">
                  {["BASIC", "PRO", "MAX"].map(plan => (
                    <label key={plan} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={form.membership_plan_targets.includes(plan)}
                        onCheckedChange={() => togglePlan(plan)}
                      />
                      {plan}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Masa Berlaku</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-muted-foreground">Mulai</span>
                  <Input type="datetime-local" value={form.starts_at} onChange={e => updateField("starts_at", e.target.value)} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Hingga</span>
                  <Input type="datetime-local" value={form.ends_at} onChange={e => updateField("ends_at", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Rules & Restrictions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Aturan & Pembatasan</h3>

            <div className="space-y-2">
              <Label>Tipe Diskon</Label>
              <Select value={form.discount_type} onValueChange={v => updateField("discount_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Persentase (%)</SelectItem>
                  <SelectItem value="FIXED">Potongan Tetap (Rp)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nilai *</Label>
              <Input type="number" value={form.value || ""} onChange={e => updateField("value", parseInt(e.target.value) || 0)} placeholder={form.discount_type === "PERCENTAGE" ? "10" : "25000"} />
            </div>

            {form.discount_type === "PERCENTAGE" && (
              <div className="space-y-2">
                <Label>Maks Potongan (Rp) *</Label>
                <Input type="number" value={form.max_discount_amount || ""} onChange={e => updateField("max_discount_amount", parseInt(e.target.value) || null)} placeholder="50000" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Min Pembelian (Rp)</Label>
              <Input type="number" value={form.min_purchase_amount || ""} onChange={e => updateField("min_purchase_amount", parseInt(e.target.value) || null)} placeholder="Opsional" />
            </div>

            <div className="space-y-2">
              <Label>Maks Penggunaan Total</Label>
              <Input type="number" value={form.max_total_redemptions || ""} onChange={e => updateField("max_total_redemptions", parseInt(e.target.value) || null)} placeholder="Unlimited" />
            </div>

            <div className="space-y-2">
              <Label>Maks per User</Label>
              <Input type="number" value={form.max_redemptions_per_user || ""} onChange={e => updateField("max_redemptions_per_user", parseInt(e.target.value) || null)} placeholder="Unlimited" />
            </div>

            <div className="space-y-2">
              <Label>Prioritas</Label>
              <Input type="number" value={form.priority} onChange={e => updateField("priority", parseInt(e.target.value) || 100)} />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label>Bisa digabung dengan diskon lain</Label>
              <Switch checked={form.stackable} onCheckedChange={v => updateField("stackable", v)} />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label>Status Aktif</Label>
              <Switch checked={form.status === "ACTIVE"} onCheckedChange={v => updateField("status", v ? "ACTIVE" : "INACTIVE")} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Diskon"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
