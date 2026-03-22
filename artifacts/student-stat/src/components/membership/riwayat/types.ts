export type MembershipCategory = "REXTRA Club" | "Trial Club" | "Non-Club";
export type MembershipTier = "Starter" | "Standard" | "Basic" | "Pro" | "Max";
export type EventType = "Purchase" | "Renewal" | "Upgrade" | "Downgrade" | "Trial Start" | "Trial End" | "Expired" | "Refund" | "Join";
export type PaymentStatus = "Menunggu" | "Berhasil" | "Gagal" | "Dibatalkan" | "Expired" | "Refund";
export type ValidityStatus = "Aktif" | "Akan berakhir" | "Berakhir";
export type SubscriptionHistory = "Pengguna Baru" | "Langganan Pertama" | "Pernah Berlangganan";

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  userId: string;
  avatar?: string;
  category: MembershipCategory;
  tier: MembershipTier;
  startDate: Date;
  endDate?: Date;
  remainingDays: number;
  lastPurchasePrice: number;
  lastPurchaseDuration: number; // months
  validityStatus: ValidityStatus;
  subscriptionHistory: SubscriptionHistory;
  tokenBalance: number;
  pointsBalance: number;
  entitlementCount: number;
}

export interface JourneyEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  statusBefore: string;
  statusAfter: string;
  duration?: string;
  total?: number;
  promoCode?: string;
  promoDiscount?: number;
  isFuture?: boolean;
}

export interface Transaction {
  id: string;
  referenceId: string;
  date: Date;
  user: {
    name: string;
    email: string;
    userId: string;
  };
  eventType: EventType;
  statusBefore: string;
  statusAfter: string;
  category: MembershipCategory;
  duration: string;
  basePrice: number;
  durationDiscount: number;
  promoCode?: string;
  promoDiscount: number;
  adminFee: number;
  totalPaid: number;
  paymentMethod: string;
  paymentGatewayRef?: string;
  paymentStatus: PaymentStatus;
  tokenGiven: number;
  pointsGiven: number;
  paymentTimeline: {
    time: string;
    status: string;
  }[];
}
