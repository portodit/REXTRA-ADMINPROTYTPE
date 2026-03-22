import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Discount {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  applies_to: string;
  membership_plan_targets: string[] | null;
  topup_targets: string[] | null;
  discount_type: string;
  value: number;
  max_discount_amount: number | null;
  min_purchase_amount: number | null;
  max_total_redemptions: number | null;
  max_redemptions_per_user: number | null;
  stackable: boolean;
  priority: number;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface DiscountRedemption {
  id: string;
  discount_id: string;
  code_snapshot: string;
  user_id: string;
  user_name: string | null;
  transaction_id: string | null;
  applies_to_type: string;
  plan_snapshot: string | null;
  subtotal_amount: number;
  discount_amount: number;
  final_amount: number;
  status: string;
  applied_at: string;
  reversed_at: string | null;
  reverse_reason: string | null;
}

export type DiscountFilters = {
  search: string;
  status: string;
  applies_to: string;
  plan: string;
  discount_type: string;
};

export function getDisplayStatus(d: Discount): string {
  if (d.status === "INACTIVE") return "Nonaktif";
  if (d.ends_at && new Date(d.ends_at) < new Date()) return "Kedaluwarsa";
  if (d.starts_at && new Date(d.starts_at) > new Date()) return "Terjadwal";
  if (d.status === "ACTIVE") return "Aktif";
  return d.status;
}

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Gagal memuat diskon", description: error.message, variant: "destructive" });
    } else {
      setDiscounts((data as any[]) || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const { error } = await supabase
      .from("discounts")
      .update({ status: newStatus, updated_at: new Date().toISOString() } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Gagal mengubah status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Diskon ${newStatus === "ACTIVE" ? "diaktifkan" : "dinonaktifkan"}` });
      fetchDiscounts();
    }
  };

  const saveDiscount = async (data: Partial<Discount>, isEdit: boolean) => {
    if (isEdit && data.id) {
      const { error } = await supabase
        .from("discounts")
        .update({ ...data, updated_at: new Date().toISOString() } as any)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("discounts")
        .insert(data as any);
      if (error) throw error;
    }
    fetchDiscounts();
  };

  const deleteDiscount = async (id: string) => {
    const { error } = await supabase.from("discounts").delete().eq("id", id);
    if (error) throw error;
    fetchDiscounts();
  };

  return { discounts, loading, fetchDiscounts, toggleStatus, saveDiscount, deleteDiscount };
}

export function useDiscountDetail(id: string | undefined) {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [redemptions, setRedemptions] = useState<DiscountRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [dRes, rRes] = await Promise.all([
      supabase.from("discounts").select("*").eq("id", id).single(),
      supabase.from("discount_redemptions").select("*").eq("discount_id", id).order("applied_at", { ascending: false }).limit(50),
    ]);
    if (dRes.error) {
      toast({ title: "Diskon tidak ditemukan", variant: "destructive" });
    } else {
      setDiscount(dRes.data as any);
    }
    setRedemptions((rRes.data as any[]) || []);
    setLoading(false);
  }, [id, toast]);

  useEffect(() => { fetch(); }, [fetch]);

  return { discount, redemptions, loading, refetch: fetch };
}
