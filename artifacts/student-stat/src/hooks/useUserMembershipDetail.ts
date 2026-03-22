import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserMembership {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_type: string;
  category: string;
  tier: string;
  plan_label: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  remaining_days: number;
  paid_cycle_count: number;
  token_balance: number;
  points_balance: number;
  entitlement_count: number;
  created_at: string;
}

export interface SubscriptionCycle {
  id: string;
  cycle_number: number;
  plan: string;
  category: string;
  status: string;
  start_date: string;
  end_date: string | null;
  duration_months: number;
  amount_paid: number;
  transaction_id: string | null;
  payment_channel: string | null;
}

export interface UsageLog {
  id: string;
  entitlement_key: string;
  entitlement_name: string;
  result: string;
  error_message: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface TokenLedgerEntry {
  id: string;
  mutation_type: string;
  amount: number;
  source: string;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface PointsLedgerEntry {
  id: string;
  mutation_type: string;
  amount: number;
  source: string;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

export function useUserMembership(membershipId: string | undefined) {
  return useQuery({
    queryKey: ["user-membership", membershipId],
    queryFn: async () => {
      if (!membershipId) throw new Error("No ID");
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*")
        .eq("id", membershipId)
        .single();
      if (error) throw error;
      return data as UserMembership;
    },
    enabled: !!membershipId,
  });
}

export function useSubscriptionCycles(membershipId: string | undefined) {
  return useQuery({
    queryKey: ["subscription-cycles", membershipId],
    queryFn: async () => {
      if (!membershipId) return [];
      const { data, error } = await supabase
        .from("subscription_cycles")
        .select("*")
        .eq("user_membership_id", membershipId)
        .order("cycle_number", { ascending: false });
      if (error) throw error;
      return (data || []) as SubscriptionCycle[];
    },
    enabled: !!membershipId,
  });
}

export function useUsageLogs(membershipId: string | undefined) {
  return useQuery({
    queryKey: ["usage-logs", membershipId],
    queryFn: async () => {
      if (!membershipId) return [];
      const { data, error } = await supabase
        .from("usage_logs")
        .select("*")
        .eq("user_membership_id", membershipId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as UsageLog[];
    },
    enabled: !!membershipId,
  });
}

export function useTokenLedger(membershipId: string | undefined) {
  return useQuery({
    queryKey: ["token-ledger", membershipId],
    queryFn: async () => {
      if (!membershipId) return [];
      const { data, error } = await supabase
        .from("token_ledger")
        .select("*")
        .eq("user_membership_id", membershipId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as TokenLedgerEntry[];
    },
    enabled: !!membershipId,
  });
}

export function usePointsLedger(membershipId: string | undefined) {
  return useQuery({
    queryKey: ["points-ledger", membershipId],
    queryFn: async () => {
      if (!membershipId) return [];
      const { data, error } = await supabase
        .from("points_ledger")
        .select("*")
        .eq("user_membership_id", membershipId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as PointsLedgerEntry[];
    },
    enabled: !!membershipId,
  });
}

export function useUserEntitlements(membershipId: string | undefined, tier: string | undefined) {
  return useQuery({
    queryKey: ["user-entitlements", membershipId, tier],
    queryFn: async () => {
      // Get entitlements from duration_access_mappings for the user's current plan
      // For now, get all active entitlements from the system as reference
      const { data, error } = await supabase
        .from("entitlements")
        .select("id, key, name, status, level, description")
        .eq("status", "active")
        .order("key");
      if (error) throw error;

      // Get entitlements with restriction info directly
      const { data: entitlements } = await supabase
        .from("entitlements")
        .select("id, key, name, status, level, description, restriction_type, token_cost")
        .eq("status", "active")
        .order("key");
      if (error) throw error;

      return (entitlements || []).map((e: any) => ({
        ...e,
        restriction_type: e.restriction_type || "unlimited",
        token_cost: e.token_cost || 0,
      }));
    },
    enabled: !!membershipId,
  });
}
