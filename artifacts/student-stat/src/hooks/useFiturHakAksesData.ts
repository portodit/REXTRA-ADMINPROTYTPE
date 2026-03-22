import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────
export interface SubFitur {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  usedByEntitlements: number;
  mappedToPlans: number;
}

export interface Fitur {
  id: string;
  name: string;
  slug: string;
  prefix: string;
  type: "tunggal" | "bertingkat";
  description: string;
  status: "active" | "inactive";
  subFitur: SubFitur[];
  usedByEntitlements: string[];
  mappedToPlans: number;
}

export interface KategoriAksi {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  usedByEntitlements: number;
}

export interface HakAkses {
  id: string;
  name: string;
  key: string;
  level: "fitur" | "sub_fitur";
  fiturName: string;
  fiturPrefix: string;
  subFiturName: string;
  kategoriAksiSlug: string;
  kategoriAksiName: string;
  description: string;
  status: "active" | "inactive";
  restrictionType: "unlimited" | "token_gated" | "frequency_limited" | "locked";
  tokenCost: number;
  usedByPlans: number;
}

export type DataLoadState = "loading" | "data" | "empty" | "error";

export function useFiturData() {
  const [fiturData, setFiturData] = useState<Fitur[]>([]);
  const [loadState, setLoadState] = useState<DataLoadState>("loading");

  const fetchData = useCallback(async () => {
    setLoadState("loading");
    try {
      const { data: features, error: fErr } = await supabase
        .from("features")
        .select("*")
        .order("created_at");
      if (fErr) throw fErr;

      const { data: subFeatures, error: sfErr } = await supabase
        .from("sub_features")
        .select("*")
        .order("created_at");
      if (sfErr) throw sfErr;

      const { data: entitlements, error: eErr } = await supabase
        .from("entitlements")
        .select("key, feature_id, sub_feature_id");
      if (eErr) throw eErr;

      const { data: mappings, error: mErr } = await supabase
        .from("duration_access_mappings")
        .select("entitlement_key");
      if (mErr) throw mErr;

      const mappedKeys = new Set((mappings || []).map(m => m.entitlement_key));

      // Count entitlements per sub_feature
      const subFeatureEntitlementCount: Record<string, number> = {};
      const subFeatureMappedCount: Record<string, number> = {};
      (entitlements || []).forEach((e: any) => {
        if (e.sub_feature_id) {
          subFeatureEntitlementCount[e.sub_feature_id] = (subFeatureEntitlementCount[e.sub_feature_id] || 0) + 1;
          if (mappedKeys.has(e.key)) {
            subFeatureMappedCount[e.sub_feature_id] = (subFeatureMappedCount[e.sub_feature_id] || 0) + 1;
          }
        }
      });

      const mapped: Fitur[] = (features || []).map((f: any) => {
        const subs = (subFeatures || [])
          .filter((sf: any) => sf.feature_id === f.id)
          .map((sf: any): SubFitur => ({
            id: sf.id,
            name: sf.name,
            slug: sf.slug,
            description: sf.description || "",
            status: sf.status as "active" | "inactive",
            usedByEntitlements: subFeatureEntitlementCount[sf.id] || 0,
            mappedToPlans: subFeatureMappedCount[sf.id] || 0,
          }));

        const featureEntitlements = (entitlements || [])
          .filter((e: any) => e.feature_id === f.id)
          .map((e: any) => e.key);

        const mappedCount = featureEntitlements.filter((k: string) => mappedKeys.has(k)).length;

        return {
          id: f.id,
          name: f.name,
          slug: f.slug,
          prefix: f.prefix,
          type: f.type as "tunggal" | "bertingkat",
          description: f.description || "",
          status: f.status as "active" | "inactive",
          subFitur: subs,
          usedByEntitlements: featureEntitlements,
          mappedToPlans: mappedCount,
        };
      });

      setFiturData(mapped);
      setLoadState(mapped.length === 0 ? "empty" : "data");
    } catch (err) {
      console.error("Failed to fetch fitur data:", err);
      setLoadState("error");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // CRUD operations
  const addFitur = async (form: { name: string; slug: string; prefix: string; type: "tunggal" | "bertingkat"; description: string; status: "active" | "inactive" }) => {
    const { data, error } = await supabase
      .from("features")
      .insert({ name: form.name, slug: form.slug, prefix: form.prefix, type: form.type, description: form.description, status: form.status })
      .select()
      .single();
    if (error) { toast.error("Gagal menambah fitur: " + error.message); return null; }
    const newFitur: Fitur = {
      id: data.id, name: data.name, slug: data.slug, prefix: data.prefix,
      type: data.type as "tunggal" | "bertingkat", description: data.description || "",
      status: data.status as "active" | "inactive", subFitur: [], usedByEntitlements: [], mappedToPlans: 0,
    };
    setFiturData(prev => [...prev, newFitur]);
    setLoadState("data");
    return newFitur;
  };

  const updateFitur = async (id: string, form: { name: string; slug: string; prefix: string; type: "tunggal" | "bertingkat"; description: string; status: "active" | "inactive" }) => {
    const { error } = await supabase
      .from("features")
      .update({ name: form.name, slug: form.slug, prefix: form.prefix, type: form.type, description: form.description, status: form.status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error("Gagal update fitur: " + error.message); return false; }
    setFiturData(prev => prev.map(f => f.id === id ? { ...f, ...form } : f));
    return true;
  };

  const deleteFitur = async (id: string) => {
    const { error } = await supabase.from("features").delete().eq("id", id);
    if (error) { toast.error("Gagal menghapus fitur: " + error.message); return false; }
    setFiturData(prev => {
      const updated = prev.filter(f => f.id !== id);
      if (updated.length === 0) setLoadState("empty");
      return updated;
    });
    return true;
  };

  // Cascade delete: delete entitlements + mappings, then the fitur
  const deleteFiturCascade = async (id: string) => {
    try {
      // Get entitlement keys for this feature
      const { data: ents } = await supabase
        .from("entitlements")
        .select("id, key")
        .eq("feature_id", id);
      
      const entKeys = (ents || []).map(e => e.key);
      
      // Delete mappings that use these entitlement keys
      if (entKeys.length > 0) {
        await supabase
          .from("duration_access_mappings")
          .delete()
          .in("entitlement_key", entKeys);
      }
      
      // Delete entitlements
      await supabase
        .from("entitlements")
        .delete()
        .eq("feature_id", id);
      
      // Delete sub_features
      await supabase
        .from("sub_features")
        .delete()
        .eq("feature_id", id);
      
      // Delete feature
      const { error } = await supabase.from("features").delete().eq("id", id);
      if (error) throw error;
      
      setFiturData(prev => {
        const updated = prev.filter(f => f.id !== id);
        if (updated.length === 0) setLoadState("empty");
        return updated;
      });
      return true;
    } catch (err: any) {
      toast.error("Gagal menghapus fitur: " + err.message);
      return false;
    }
  };

  const addSubFitur = async (featureId: string, form: { name: string; slug: string; description: string; status: "active" | "inactive" }) => {
    const { data, error } = await supabase
      .from("sub_features")
      .insert({ feature_id: featureId, name: form.name, slug: form.slug, tipe_akses: "unlimited", description: form.description, status: form.status })
      .select()
      .single();
    if (error) { toast.error("Gagal menambah sub fitur: " + error.message); return null; }
    const newSf: SubFitur = { id: data.id, name: data.name, slug: data.slug, description: data.description || "", status: data.status as "active" | "inactive", usedByEntitlements: 0, mappedToPlans: 0 };
    setFiturData(prev => prev.map(f => f.id === featureId ? { ...f, subFitur: [...f.subFitur, newSf] } : f));
    return newSf;
  };

  const updateSubFitur = async (featureId: string, subId: string, form: { name: string; slug: string; description: string; status: "active" | "inactive" }) => {
    const { error } = await supabase
      .from("sub_features")
      .update({ name: form.name, slug: form.slug, description: form.description, status: form.status, updated_at: new Date().toISOString() })
      .eq("id", subId);
    if (error) { toast.error("Gagal update sub fitur: " + error.message); return false; }
    setFiturData(prev => prev.map(f =>
      f.id === featureId ? { ...f, subFitur: f.subFitur.map(sf => sf.id === subId ? { ...sf, ...form } : sf) } : f
    ));
    return true;
  };

  const deleteSubFitur = async (featureId: string, subId: string) => {
    const { error } = await supabase.from("sub_features").delete().eq("id", subId);
    if (error) { toast.error("Gagal menghapus sub fitur: " + error.message); return false; }
    setFiturData(prev => prev.map(f =>
      f.id === featureId ? { ...f, subFitur: f.subFitur.filter(sf => sf.id !== subId) } : f
    ));
    return true;
  };

  // Cascade delete sub fitur: delete entitlements + mappings linked to this sub fitur
  const deleteSubFiturCascade = async (featureId: string, subId: string) => {
    try {
      // Get entitlement keys for this sub feature
      const { data: ents } = await supabase
        .from("entitlements")
        .select("id, key")
        .eq("sub_feature_id", subId);
      
      const entKeys = (ents || []).map(e => e.key);
      
      // Delete mappings
      if (entKeys.length > 0) {
        await supabase
          .from("duration_access_mappings")
          .delete()
          .in("entitlement_key", entKeys);
      }
      
      // Delete entitlements
      await supabase
        .from("entitlements")
        .delete()
        .eq("sub_feature_id", subId);
      
      // Delete sub feature
      const { error } = await supabase.from("sub_features").delete().eq("id", subId);
      if (error) throw error;
      
      setFiturData(prev => prev.map(f =>
        f.id === featureId ? { ...f, subFitur: f.subFitur.filter(sf => sf.id !== subId) } : f
      ));
      return true;
    } catch (err: any) {
      toast.error("Gagal menghapus sub fitur: " + err.message);
      return false;
    }
  };

  return {
    fiturData, setFiturData, loadState, setLoadState, fetchData,
    addFitur, updateFitur, deleteFitur, deleteFiturCascade,
    addSubFitur, updateSubFitur, deleteSubFitur, deleteSubFiturCascade,
  };
}

// useKategoriAksiData and useHakAksesData functions
export function useKategoriAksiData() {
  const [kategoriData, setKategoriData] = useState<KategoriAksi[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: categories, error: cErr } = await supabase
        .from("action_categories")
        .select("*")
        .order("created_at");
      if (cErr) throw cErr;

      const { data: entitlements, error: eErr } = await supabase
        .from("entitlements")
        .select("action_category_id");
      if (eErr) throw eErr;

      const countMap: Record<string, number> = {};
      (entitlements || []).forEach((e: any) => {
        countMap[e.action_category_id] = (countMap[e.action_category_id] || 0) + 1;
      });

      const mapped: KategoriAksi[] = (categories || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        status: c.status as "active" | "inactive",
        usedByEntitlements: countMap[c.id] || 0,
      }));

      setKategoriData(mapped);
    } catch (err) {
      console.error("Failed to fetch kategori data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addKategori = async (form: { name: string; slug: string; description: string; status: "active" | "inactive" }) => {
    const { data, error } = await supabase
      .from("action_categories")
      .insert({ name: form.name, slug: form.slug, description: form.description, status: form.status })
      .select()
      .single();
    if (error) { toast.error("Gagal menambah kategori: " + error.message); return null; }
    const newK: KategoriAksi = { id: data.id, name: data.name, slug: data.slug, description: data.description || "", status: data.status as "active" | "inactive", usedByEntitlements: 0 };
    setKategoriData(prev => [...prev, newK]);
    return newK;
  };

  const updateKategori = async (id: string, form: { name: string; slug: string; description: string; status: "active" | "inactive" }) => {
    const { error } = await supabase
      .from("action_categories")
      .update({ name: form.name, slug: form.slug, description: form.description, status: form.status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error("Gagal update kategori: " + error.message); return false; }
    setKategoriData(prev => prev.map(k => k.id === id ? { ...k, ...form } : k));
    return true;
  };

  const bulkUpdateStatus = async (ids: string[], status: "active" | "inactive") => {
    const { error } = await supabase
      .from("action_categories")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);
    if (error) { toast.error("Gagal update status: " + error.message); return false; }
    setKategoriData(prev => prev.map(k => ids.includes(k.id) ? { ...k, status } : k));
    return true;
  };

  return { kategoriData, setKategoriData, loading, fetchData, addKategori, updateKategori, bulkUpdateStatus };
}

export function useHakAksesData() {
  const [hakAksesData, setHakAksesData] = useState<HakAkses[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: entitlements, error: eErr } = await supabase
        .from("entitlements")
        .select("*, features!inner(name, prefix, type), sub_features(name, slug), action_categories!inner(name, slug)")
        .order("created_at");
      if (eErr) throw eErr;

      const { data: mappings, error: mErr } = await supabase
        .from("duration_access_mappings")
        .select("entitlement_key");
      if (mErr) throw mErr;

      const usageMap: Record<string, number> = {};
      (mappings || []).forEach((m: any) => {
        usageMap[m.entitlement_key] = (usageMap[m.entitlement_key] || 0) + 1;
      });

      const mapped: HakAkses[] = (entitlements || []).map((e: any) => ({
        id: e.id,
        name: e.name,
        key: e.key,
        level: e.level as "fitur" | "sub_fitur",
        fiturName: e.features?.name || "",
        fiturPrefix: e.features?.prefix || "",
        subFiturName: e.sub_features?.name || "",
        kategoriAksiSlug: e.action_categories?.slug || "",
        kategoriAksiName: e.action_categories?.name || "",
        description: e.description || "",
        status: e.status as "active" | "inactive",
        restrictionType: (e.restriction_type || "unlimited") as "unlimited" | "token_gated" | "frequency_limited" | "locked",
        tokenCost: e.token_cost || 0,
        usedByPlans: usageMap[e.key] || 0,
      }));

      setHakAksesData(mapped);
    } catch (err) {
      console.error("Failed to fetch hak akses data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addHakAkses = async (form: {
    name: string; key: string; level: "fitur" | "sub_fitur";
    featureId: string; subFeatureId: string | null; actionCategoryId: string;
    description: string; status: "active" | "inactive";
    restrictionType: "unlimited" | "token_gated" | "frequency_limited" | "locked";
    tokenCost: number;
    fiturName: string; fiturPrefix: string; subFiturName: string;
    kategoriAksiSlug: string; kategoriAksiName: string;
  }) => {
    const { data, error } = await supabase
      .from("entitlements")
      .insert({
        name: form.name, key: form.key, level: form.level,
        feature_id: form.featureId, sub_feature_id: form.subFeatureId || null,
        action_category_id: form.actionCategoryId,
        description: form.description, status: form.status,
        restriction_type: form.restrictionType,
        token_cost: form.restrictionType === "token_gated" ? form.tokenCost : 0,
        usage_limit: 0,
      })
      .select()
      .single();
    if (error) { toast.error("Gagal menambah hak akses: " + error.message); return null; }
    const newH: HakAkses = {
      id: data.id, name: form.name, key: form.key, level: form.level,
      fiturName: form.fiturName, fiturPrefix: form.fiturPrefix,
      subFiturName: form.subFiturName, kategoriAksiSlug: form.kategoriAksiSlug,
      kategoriAksiName: form.kategoriAksiName, description: form.description,
      status: form.status as "active" | "inactive",
      restrictionType: form.restrictionType, tokenCost: form.tokenCost,
      usedByPlans: 0,
    };
    setHakAksesData(prev => [...prev, newH]);
    return newH;
  };

  const updateHakAkses = async (id: string, updates: Partial<{ name: string; description: string; status: "active" | "inactive"; key: string; restriction_type: string; token_cost: number }>) => {
    const { error } = await supabase
      .from("entitlements")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error("Gagal update hak akses: " + error.message); return false; }
    setHakAksesData(prev => prev.map(h => h.id === id ? {
      ...h,
      ...updates,
      restrictionType: (updates.restriction_type as any) || h.restrictionType,
      tokenCost: updates.token_cost ?? h.tokenCost,
    } : h));
    return true;
  };

  const deleteHakAkses = async (id: string) => {
    const { error } = await supabase.from("entitlements").delete().eq("id", id);
    if (error) { toast.error("Gagal menghapus hak akses: " + error.message); return false; }
    setHakAksesData(prev => prev.filter(h => h.id !== id));
    return true;
  };

  const bulkUpdateStatus = async (ids: string[], status: "active" | "inactive") => {
    const { error } = await supabase
      .from("entitlements")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);
    if (error) { toast.error("Gagal update status: " + error.message); return false; }
    setHakAksesData(prev => prev.map(h => ids.includes(h.id) ? { ...h, status } : h));
    return true;
  };

  return { hakAksesData, setHakAksesData, loading, fetchData, addHakAkses, updateHakAkses, deleteHakAkses, bulkUpdateStatus };
}
