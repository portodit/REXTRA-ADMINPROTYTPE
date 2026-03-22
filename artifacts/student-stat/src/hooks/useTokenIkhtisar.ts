import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TokenSourceType = Database["public"]["Enums"]["token_source_type"];

export type SourceFilter = "semua" | "topup" | "alokasi" | "pemakaian";

interface LedgerRow {
  id: string;
  user_id: string;
  direction: "IN" | "OUT";
  source_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference_id: string | null;
  occurred_at: string;
  metadata: Record<string, any>;
}

const sourceTypeMap: Record<SourceFilter, TokenSourceType[]> = {
  semua: [],
  topup: ["TOPUP"],
  alokasi: ["MEMBERSHIP"],
  pemakaian: ["USAGE"],
};

function getPeriodCutoff(period: string): Date | null {
  const now = new Date();
  switch (period) {
    case "7d": return new Date(now.getTime() - 7 * 86400000);
    case "30d": return new Date(now.getTime() - 30 * 86400000);
    case "90d": return new Date(now.getTime() - 90 * 86400000);
    default: return null;
  }
}

export function useTokenLedgerData(tab: SourceFilter, period: string) {
  return useQuery({
    queryKey: ["token-ikhtisar-ledger", tab, period],
    queryFn: async () => {
      let query = supabase
        .from("token_system_ledger")
        .select("*")
        .order("occurred_at", { ascending: false });

      // Filter by source_type based on tab
      const types = sourceTypeMap[tab];
      if (types.length === 1) {
        query = query.eq("source_type", types[0]);
      }

      // Period filter
      const cutoff = getPeriodCutoff(period);
      if (cutoff) {
        query = query.gte("occurred_at", cutoff.toISOString());
      }

      const { data, error } = await query.limit(500);
      if (error) throw error;
      return (data || []) as LedgerRow[];
    },
  });
}

export function useTokenKPI(tab: SourceFilter, period: string) {
  return useQuery({
    queryKey: ["token-ikhtisar-kpi", tab, period],
    queryFn: async () => {
      let query = supabase
        .from("token_system_ledger")
        .select("direction, source_type, amount");

      const types = sourceTypeMap[tab];
      if (types.length === 1) {
        query = query.eq("source_type", types[0]);
      }

      const cutoff = getPeriodCutoff(period);
      if (cutoff) {
        query = query.gte("occurred_at", cutoff.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      const entries = data || [];

      let tokenMasuk = 0;
      let tokenKeluar = 0;
      let topUpCount = 0;
      let alokasiTotal = 0;
      let pemakaianTotal = 0;

      for (const e of entries) {
        if (e.direction === "IN") {
          tokenMasuk += e.amount;
          if (e.source_type === "TOPUP") topUpCount++;
          if (e.source_type === "MEMBERSHIP") alokasiTotal += e.amount;
        } else {
          tokenKeluar += e.amount;
          if (e.source_type === "USAGE") pemakaianTotal += e.amount;
        }
      }

      return {
        tokenMasuk,
        tokenKeluar,
        netFlow: tokenMasuk - tokenKeluar,
        topUpCount,
        alokasiTotal,
        pemakaianTotal,
      };
    },
  });
}

export function useTokenChartData(tab: SourceFilter, period: string) {
  return useQuery({
    queryKey: ["token-ikhtisar-chart", tab, period],
    queryFn: async () => {
      let query = supabase
        .from("token_system_ledger")
        .select("direction, source_type, amount, occurred_at");

      const types = sourceTypeMap[tab];
      if (types.length === 1) {
        query = query.eq("source_type", types[0]);
      }

      const cutoff = getPeriodCutoff(period);
      if (cutoff) {
        query = query.gte("occurred_at", cutoff.toISOString());
      }

      const { data, error } = await query.order("occurred_at", { ascending: true });
      if (error) throw error;

      // Group by day
      const dayMap = new Map<string, { masuk: number; keluar: number; topup: number; alokasi: number; pemakaian: number }>();

      for (const e of data || []) {
        const day = new Date(e.occurred_at).toLocaleDateString("id-ID", { weekday: "short" });
        const dateKey = new Date(e.occurred_at).toISOString().split("T")[0];
        const key = `${dateKey}_${day}`;
        
        if (!dayMap.has(key)) {
          dayMap.set(key, { masuk: 0, keluar: 0, topup: 0, alokasi: 0, pemakaian: 0 });
        }
        const d = dayMap.get(key)!;

        if (e.direction === "IN") {
          d.masuk += e.amount;
          if (e.source_type === "TOPUP") d.topup += e.amount;
          if (e.source_type === "MEMBERSHIP") d.alokasi += e.amount;
        } else {
          d.keluar += e.amount;
          if (e.source_type === "USAGE") d.pemakaian += e.amount;
        }
      }

      // Sort by date key and return
      return Array.from(dayMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, values]) => ({
          day: key.split("_")[1] || key,
          ...values,
        }));
    },
  });
}

export function useTopupTransactionCount(period: string) {
  return useQuery({
    queryKey: ["topup-success-count", period],
    queryFn: async () => {
      let query = supabase
        .from("topup_transaction")
        .select("id", { count: "exact", head: true })
        .eq("status", "SUCCESS");

      const cutoff = getPeriodCutoff(period);
      if (cutoff) {
        query = query.gte("paid_at", cutoff.toISOString());
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });
}
