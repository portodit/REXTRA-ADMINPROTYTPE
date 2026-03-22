export type PlanStatus = "draft" | "aktif" | "nonaktif";
export type DurationMonth = 1 | 3 | 6 | 12;
export type RestrictionType = "unlimited" | "token_gated" | "frequency_limited" | "locked";
export type ResetPeriod = "daily" | "weekly" | "monthly";
export type PricingMode = "manual" | "otomatis";
export type DurationMode = "tanpa_durasi" | "dengan_durasi" | "starter_durasi";

export interface PlanDetail {
  id: string;
  name: string;
  category: "paid" | "unpaid";
  status: PlanStatus;
  emblemKey: string;
  description: string;
  tierLabel: string;
  activeUsers: number;
  durationMode: DurationMode;
  pricingMode: PricingMode;
  basePrice1m: number;
  baseToken1m: number;
  discount3m: number;
  discount6m: number;
  discount12m: number;
  bonusToken3m: number;
  bonusToken6m: number;
  bonusToken12m: number;
  updatedAt: string;
  updatedBy: string;
}

export interface PlanDuration {
  id: string;
  planId: string;
  durationMonths: DurationMonth;
  isActive: boolean;
  price: number;
  discountPercent: number;
  finalPrice: number;
  durationPrice: number;
  tokenAmount: number;
  bonusToken: number;
  pointsActive: boolean;
  pointsValue: number;
  bonusPoints: number;
}

export interface AccessMapping {
  id: string;
  planDurationId: string;
  entitlementId: string;
  entitlementName: string;
  entitlementKey: string;
  category: string;
  restrictionType: RestrictionType;
  tokenCost: number;
  usageQuota: number;
  status: "aktif" | "nonaktif";
}

export const DURATION_LABELS: Record<DurationMonth, string> = {
  1: "1 Bulan",
  3: "3 Bulan",
  6: "6 Bulan",
  12: "12 Bulan",
};

export const ALL_DURATIONS: DurationMonth[] = [1, 3, 6, 12];
