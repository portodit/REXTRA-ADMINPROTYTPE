import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NotificationSettings {
  id: string;
  is_enabled: boolean;
  triggers: string[];
  email_subject_template: string;
  email_body_template: string;
  updated_at: string;
  updated_by: string | null;
}

export interface InvoiceSettings {
  id: string;
  company_name: string;
  company_address: string;
  footer_text: string;
  default_due_days: number;
  base_invoice_url: string | null;
  notes: string[];
  invoice_prefix: string;
  invoice_reset_rule: string;
  invoice_title: string;
  logo_url: string | null;
  terms_content: string | null;
  email_footer_text: string;
  updated_at: string;
  updated_by: string | null;
}

export interface TransactionIdSettings {
  id: string;
  trx_prefix: string;
  trx_pattern: string;
  updated_at: string;
  updated_by: string | null;
}

export function useMembershipSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationSettings | null>(null);
  const [invoice, setInvoice] = useState<InvoiceSettings | null>(null);
  const [transactionId, setTransactionId] = useState<TransactionIdSettings | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [nRes, iRes, tRes] = await Promise.all([
        supabase.from("membership_notification_settings" as any).select("*").limit(1).single(),
        supabase.from("invoice_settings" as any).select("*").limit(1).single(),
        supabase.from("transaction_id_settings" as any).select("*").limit(1).single(),
      ]);
      if (nRes.data) setNotification(nRes.data as any);
      if (iRes.data) setInvoice(iRes.data as any);
      if (tRes.data) setTransactionId(tRes.data as any);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const saveNotification = async (data: Partial<NotificationSettings>) => {
    if (!notification) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("membership_notification_settings" as any)
        .update({ ...data, updated_at: new Date().toISOString(), updated_by: "Admin" } as any)
        .eq("id", notification.id);
      if (error) throw error;
      setNotification({ ...notification, ...data } as any);
      toast({ title: "Berhasil", description: "Pengaturan notifikasi berhasil disimpan." });
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveInvoice = async (data: Partial<InvoiceSettings>) => {
    if (!invoice) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("invoice_settings" as any)
        .update({ ...data, updated_at: new Date().toISOString(), updated_by: "Admin" } as any)
        .eq("id", invoice.id);
      if (error) throw error;
      setInvoice({ ...invoice, ...data } as any);
      toast({ title: "Berhasil", description: "Pengaturan dokumen berhasil disimpan." });
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveTransactionId = async (data: Partial<TransactionIdSettings>) => {
    if (!transactionId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("transaction_id_settings" as any)
        .update({ ...data, updated_at: new Date().toISOString(), updated_by: "Admin" } as any)
        .eq("id", transactionId.id);
      if (error) throw error;
      setTransactionId({ ...transactionId, ...data } as any);
      toast({ title: "Berhasil", description: "Format ID transaksi berhasil disimpan." });
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const resetDocumentDefaults = async () => {
    await saveInvoice({
      company_name: "Rextra",
      footer_text: "Dokumen ini dibuat secara otomatis oleh sistem.",
      default_due_days: 0,
      base_invoice_url: "",
      notes: [],
      invoice_prefix: "INV",
      invoice_reset_rule: "MONTHLY",
      logo_url: null,
      terms_content: "",
    });
    await saveTransactionId({
      trx_prefix: "TRX",
      trx_pattern: "DATE_DAILY",
    });
  };

  return {
    loading,
    saving,
    notification,
    invoice,
    transactionId,
    saveNotification,
    saveInvoice,
    saveTransactionId,
    resetDocumentDefaults,
    refetch: fetchAll,
  };
}
