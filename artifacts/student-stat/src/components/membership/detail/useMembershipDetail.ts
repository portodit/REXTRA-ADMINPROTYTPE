import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { PlanDetail, PlanDuration, AccessMapping, DurationMonth, PricingMode, DurationMode, RestrictionType } from "./types";

export function useMembershipDetail(planId: string) {
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [durations, setDurations] = useState<PlanDuration[]>([]);
  const [accessMappings, setAccessMappings] = useState<AccessMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: planData, error: planErr } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("id", planId)
        .single();
      if (planErr) throw planErr;

      const mapped: PlanDetail = {
        id: planData.id,
        name: planData.name,
        category: planData.category as "paid" | "unpaid",
        status: planData.status as PlanDetail["status"],
        emblemKey: planData.emblem_key,
        description: planData.description || "",
        tierLabel: planData.tier_label || "",
        activeUsers: planData.active_users || 0,
        durationMode: (planData.duration_mode || "tanpa_durasi") as DurationMode,
        pricingMode: (planData.pricing_mode || "manual") as PricingMode,
        basePrice1m: planData.base_price_1m || 0,
        baseToken1m: planData.base_token_1m || 0,
        discount3m: Number(planData.discount_3m) || 0,
        discount6m: Number(planData.discount_6m) || 0,
        discount12m: Number(planData.discount_12m) || 0,
        bonusToken3m: planData.bonus_token_3m || 0,
        bonusToken6m: planData.bonus_token_6m || 0,
        bonusToken12m: planData.bonus_token_12m || 0,
        updatedAt: planData.updated_at || "",
        updatedBy: planData.updated_by || "System",
      };
      setPlan(mapped);

      const { data: durData, error: durErr } = await supabase
        .from("plan_durations")
        .select("*")
        .eq("plan_id", planId)
        .order("duration_months");
      if (durErr) throw durErr;

      const mappedDur: PlanDuration[] = (durData || []).map((d: any) => ({
        id: d.id,
        planId: d.plan_id,
        durationMonths: d.duration_months as DurationMonth,
        isActive: d.is_active,
        price: d.price || 0,
        discountPercent: Number(d.discount_percent) || 0,
        finalPrice: d.final_price || 0,
        durationPrice: d.duration_price || 0,
        tokenAmount: d.token_amount || 0,
        bonusToken: d.bonus_token || 0,
        pointsActive: d.points_active || false,
        pointsValue: d.points_value || 0,
        bonusPoints: d.bonus_points || 0,
      }));
      setDurations(mappedDur);

      // Fetch access mappings with entitlement join for restriction info
      const durIds = mappedDur.map((d) => d.id);
      if (durIds.length > 0) {
        const { data: mapData, error: mapErr } = await supabase
          .from("duration_access_mappings")
          .select("*, entitlements!duration_access_mappings_entitlement_id_fkey(restriction_type, token_cost)")
          .in("plan_duration_id", durIds);
        if (mapErr) throw mapErr;

        const mappedAccess: AccessMapping[] = (mapData || []).map((m: any) => ({
          id: m.id,
          planDurationId: m.plan_duration_id,
          entitlementId: m.entitlement_id,
          entitlementName: m.entitlement_name,
          entitlementKey: m.entitlement_key,
          category: m.category || "",
          restrictionType: ((m.entitlements as any)?.restriction_type || "unlimited") as RestrictionType,
          tokenCost: (m.entitlements as any)?.token_cost || 0,
          usageQuota: m.usage_quota || 0,
          status: m.status as "aktif" | "nonaktif",
        }));
        setAccessMappings(mappedAccess);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle duration active
  const toggleDuration = async (durationMonths: DurationMonth, newActive: boolean) => {
    const dur = durations.find((d) => d.durationMonths === durationMonths);
    if (!dur) return;

    if (!newActive) {
      const activeCount = durations.filter((d) => d.isActive).length;
      if (activeCount <= 1) {
        toast({ variant: "destructive", title: "Minimal 1 durasi harus aktif." });
        return false;
      }
    }

    const { error } = await supabase
      .from("plan_durations")
      .update({ is_active: newActive })
      .eq("id", dur.id);
    if (error) {
      toast({ variant: "destructive", title: "Gagal update durasi" });
      return false;
    }

    setDurations((prev) =>
      prev.map((d) => (d.id === dur.id ? { ...d, isActive: newActive } : d))
    );
    return true;
  };

  // Update plan
  const updatePlan = async (updates: Partial<PlanDetail>) => {
    if (!plan) return;
    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.durationMode !== undefined) dbUpdates.duration_mode = updates.durationMode;
    if (updates.pricingMode !== undefined) dbUpdates.pricing_mode = updates.pricingMode;
    if (updates.basePrice1m !== undefined) dbUpdates.base_price_1m = updates.basePrice1m;
    if (updates.baseToken1m !== undefined) dbUpdates.base_token_1m = updates.baseToken1m;
    if (updates.discount3m !== undefined) dbUpdates.discount_3m = updates.discount3m;
    if (updates.discount6m !== undefined) dbUpdates.discount_6m = updates.discount6m;
    if (updates.discount12m !== undefined) dbUpdates.discount_12m = updates.discount12m;
    if (updates.bonusToken3m !== undefined) dbUpdates.bonus_token_3m = updates.bonusToken3m;
    if (updates.bonusToken6m !== undefined) dbUpdates.bonus_token_6m = updates.bonusToken6m;
    if (updates.bonusToken12m !== undefined) dbUpdates.bonus_token_12m = updates.bonusToken12m;
    dbUpdates.updated_at = new Date().toISOString();
    dbUpdates.updated_by = "Admin";

    const { error } = await supabase
      .from("membership_plans")
      .update(dbUpdates)
      .eq("id", plan.id);
    if (error) {
      toast({ variant: "destructive", title: "Gagal menyimpan", description: error.message });
      return false;
    }
    setPlan((prev) => prev ? { ...prev, ...updates, updatedAt: dbUpdates.updated_at, updatedBy: "Admin" } : null);
    return true;
  };

  // Update duration pricing/points
  const updateDuration = async (durId: string, updates: Partial<PlanDuration>) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.discountPercent !== undefined) dbUpdates.discount_percent = updates.discountPercent;
    if (updates.finalPrice !== undefined) dbUpdates.final_price = updates.finalPrice;
    if (updates.durationPrice !== undefined) dbUpdates.duration_price = updates.durationPrice;
    if (updates.tokenAmount !== undefined) dbUpdates.token_amount = updates.tokenAmount;
    if (updates.bonusToken !== undefined) dbUpdates.bonus_token = updates.bonusToken;
    if (updates.pointsActive !== undefined) dbUpdates.points_active = updates.pointsActive;
    if (updates.pointsValue !== undefined) dbUpdates.points_value = updates.pointsValue;
    if (updates.bonusPoints !== undefined) dbUpdates.bonus_points = updates.bonusPoints;

    const { error } = await supabase
      .from("plan_durations")
      .update(dbUpdates)
      .eq("id", durId);
    if (error) {
      toast({ variant: "destructive", title: "Gagal update durasi" });
      return false;
    }
    setDurations((prev) =>
      prev.map((d) => (d.id === durId ? { ...d, ...updates } : d))
    );
    return true;
  };

  // Add access mapping
  const addAccessMapping = async (mapping: Omit<AccessMapping, "id">) => {
    const { data, error } = await supabase
      .from("duration_access_mappings")
      .insert({
        plan_duration_id: mapping.planDurationId,
        entitlement_id: mapping.entitlementId,
        entitlement_name: mapping.entitlementName,
        entitlement_key: mapping.entitlementKey,
        category: mapping.category,
        usage_quota: mapping.usageQuota,
        status: mapping.status,
      })
      .select()
      .single();
    if (error) {
      toast({ variant: "destructive", title: "Gagal menambah mapping" });
      return null;
    }
    const newMapping: AccessMapping = {
      id: data.id,
      planDurationId: data.plan_duration_id,
      entitlementId: data.entitlement_id,
      entitlementName: data.entitlement_name,
      entitlementKey: data.entitlement_key,
      category: data.category || "",
      restrictionType: mapping.restrictionType,
      tokenCost: mapping.tokenCost,
      usageQuota: data.usage_quota || 0,
      status: data.status as "aktif" | "nonaktif",
    };
    setAccessMappings((prev) => [...prev, newMapping]);
    return newMapping;
  };

  // Update access mapping
  const updateAccessMapping = async (mappingId: string, updates: Partial<AccessMapping>) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.usageQuota !== undefined) dbUpdates.usage_quota = updates.usageQuota;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase
      .from("duration_access_mappings")
      .update(dbUpdates)
      .eq("id", mappingId);
    if (error) {
      toast({ variant: "destructive", title: "Gagal update mapping" });
      return false;
    }
    setAccessMappings((prev) =>
      prev.map((m) => (m.id === mappingId ? { ...m, ...updates } : m))
    );
    return true;
  };

  // Delete access mapping
  const deleteAccessMapping = async (mappingId: string) => {
    const { error } = await supabase
      .from("duration_access_mappings")
      .delete()
      .eq("id", mappingId);
    if (error) {
      toast({ variant: "destructive", title: "Gagal menghapus mapping" });
      return false;
    }
    setAccessMappings((prev) => prev.filter((m) => m.id !== mappingId));
    return true;
  };

  // Copy config between durations
  const copyDurationConfig = async (
    sourceDurId: string,
    targetDurId: string,
    copyAccess: boolean,
    copyPricing: boolean,
    copyPoints: boolean,
    overwrite: boolean
  ) => {
    const sourceDur = durations.find((d) => d.id === sourceDurId);
    if (!sourceDur) return false;

    if (copyPricing || copyPoints) {
      const updates: Partial<PlanDuration> = {};
      if (copyPricing) {
        updates.price = sourceDur.price;
        updates.discountPercent = sourceDur.discountPercent;
        updates.finalPrice = sourceDur.finalPrice;
        updates.durationPrice = sourceDur.durationPrice;
        updates.tokenAmount = sourceDur.tokenAmount;
        updates.bonusToken = sourceDur.bonusToken;
      }
      if (copyPoints) {
        updates.pointsActive = sourceDur.pointsActive;
        updates.pointsValue = sourceDur.pointsValue;
        updates.bonusPoints = sourceDur.bonusPoints;
      }
      await updateDuration(targetDurId, updates);
    }

    if (copyAccess) {
      const sourceMappings = accessMappings.filter((m) => m.planDurationId === sourceDurId);

      if (overwrite) {
        const targetMappings = accessMappings.filter((m) => m.planDurationId === targetDurId);
        for (const m of targetMappings) {
          await deleteAccessMapping(m.id);
        }
      }

      for (const m of sourceMappings) {
        await addAccessMapping({
          planDurationId: targetDurId,
          entitlementId: m.entitlementId,
          entitlementName: m.entitlementName,
          entitlementKey: m.entitlementKey,
          category: m.category,
          restrictionType: m.restrictionType,
          tokenCost: m.tokenCost,
          usageQuota: m.usageQuota,
          status: m.status,
        });
      }
    }

    toast({ title: "Konfigurasi berhasil disalin" });
    return true;
  };

  return {
    plan, durations, accessMappings, loading, error,
    fetchData, toggleDuration, updatePlan, updateDuration,
    addAccessMapping, updateAccessMapping, deleteAccessMapping,
    copyDurationConfig,
  };
}
