import { 
  CheckCircle2, Clock, XCircle, AlertCircle, Ban, RotateCcw,
  ShoppingCart, TrendingUp, TrendingDown, Play
} from "lucide-react";

// ============= PAYMENT STATUS BADGES =============
export type PaymentStatusType = "Berhasil" | "Menunggu" | "Gagal" | "Dibatalkan" | "Expired" | "Refund";

const paymentStatusConfig: Record<PaymentStatusType, { 
  icon: React.ReactNode; 
  bg: string; 
  text: string;
  iconClass: string;
}> = {
  "Berhasil": { 
    icon: <CheckCircle2 className="h-3.5 w-3.5" />, 
    bg: "bg-emerald-50", 
    text: "text-emerald-600",
    iconClass: "text-emerald-500"
  },
  "Menunggu": { 
    icon: <Clock className="h-3.5 w-3.5" />, 
    bg: "bg-amber-50", 
    text: "text-amber-600",
    iconClass: "text-amber-500"
  },
  "Gagal": { 
    icon: <XCircle className="h-3.5 w-3.5" />, 
    bg: "bg-red-50", 
    text: "text-red-600",
    iconClass: "text-red-500"
  },
  "Dibatalkan": { 
    icon: <Ban className="h-3.5 w-3.5" />, 
    bg: "bg-slate-100", 
    text: "text-slate-600",
    iconClass: "text-slate-500"
  },
  "Expired": { 
    icon: <AlertCircle className="h-3.5 w-3.5" />, 
    bg: "bg-slate-100", 
    text: "text-slate-500",
    iconClass: "text-slate-400"
  },
  "Refund": { 
    icon: <RotateCcw className="h-3.5 w-3.5" />, 
    bg: "bg-violet-50", 
    text: "text-violet-600",
    iconClass: "text-violet-500"
  },
};

export function PaymentStatusBadge({ status, size = "default" }: { status: string; size?: "default" | "lg" }) {
  const config = paymentStatusConfig[status as PaymentStatusType] || paymentStatusConfig["Menunggu"];
  const sizeClasses = size === "lg" 
    ? "px-3 py-1.5 text-sm gap-2" 
    : "px-2.5 py-1 text-xs gap-1.5";
  
  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-full font-medium ${config.bg} ${config.text} border border-current/10`}>
      <span className={config.iconClass}>{config.icon}</span>
      <span>{status}</span>
    </span>
  );
}

// ============= TRANSACTION TYPE BADGES =============
export type TransactionType = "First Purchase Club" | "Renewal Club" | "Upgrade Club" | "Downgrade Club" | "Trial Club" | "Trial End" | "Expired" | "Refund";

const transactionTypeConfig: Record<TransactionType, { 
  icon: React.ReactNode;
  bg: string; 
  text: string;
}> = {
  "First Purchase Club": { 
    icon: <ShoppingCart className="h-3 w-3" />,
    bg: "bg-sky-100", 
    text: "text-sky-700"
  },
  "Renewal Club": { 
    icon: <RotateCcw className="h-3 w-3" />,
    bg: "bg-emerald-100", 
    text: "text-emerald-700"
  },
  "Upgrade Club": { 
    icon: <TrendingUp className="h-3 w-3" />,
    bg: "bg-violet-100", 
    text: "text-violet-700"
  },
  "Downgrade Club": { 
    icon: <TrendingDown className="h-3 w-3" />,
    bg: "bg-amber-100", 
    text: "text-amber-700"
  },
  "Trial Club": { 
    icon: <Play className="h-3 w-3" />,
    bg: "bg-indigo-100", 
    text: "text-indigo-700"
  },
  "Trial End": { 
    icon: <XCircle className="h-3 w-3" />,
    bg: "bg-slate-100", 
    text: "text-slate-600"
  },
  "Expired": { 
    icon: <AlertCircle className="h-3 w-3" />,
    bg: "bg-red-50", 
    text: "text-red-600"
  },
  "Refund": { 
    icon: <RotateCcw className="h-3 w-3" />,
    bg: "bg-orange-100", 
    text: "text-orange-700"
  },
};

// Map event types to Indonesian transaction types
export const getTransactionType = (eventType: string): TransactionType => {
  const typeMap: Record<string, TransactionType> = {
    "Purchase": "First Purchase Club",
    "Renewal": "Renewal Club",
    "Upgrade": "Upgrade Club",
    "Downgrade": "Downgrade Club",
    "Trial Start": "Trial Club",
    "Trial End": "Trial End",
    "Expired": "Expired",
    "Refund": "Refund",
  };
  return typeMap[eventType] || "First Purchase Club";
};

export function TransactionTypeBadge({ eventType }: { eventType: string }) {
  const type = getTransactionType(eventType);
  const config = transactionTypeConfig[type] || transactionTypeConfig["First Purchase Club"];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.text} border border-current/10`}>
      {config.icon}
      <span>{type}</span>
    </span>
  );
}

// ============= TIER BADGES =============
export type TierType = "Max" | "Pro" | "Basic" | "Starter" | "Standard";

const tierConfig: Record<TierType, { 
  bg: string; 
  text: string;
  border: string;
}> = {
  "Max": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Pro": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  "Basic": { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  "Starter": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Standard": { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
};

export function TierBadge({ tier, size = "default" }: { tier: string; size?: "default" | "sm" }) {
  const config = tierConfig[tier as TierType] || tierConfig["Standard"];
  const sizeClasses = size === "sm" 
    ? "px-1.5 py-0.5 text-[10px]" 
    : "px-2 py-0.5 text-[11px]";
  
  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-full font-semibold ${config.bg} ${config.text} ${config.border} border`}>
      {tier}
    </span>
  );
}

// ============= CATEGORY BADGES =============
export type CategoryType = "REXTRA Club" | "Trial Club" | "Non-Club";

const categoryConfig: Record<CategoryType, { 
  bg: string; 
  text: string;
  label: string;
}> = {
  "REXTRA Club": { 
    bg: "bg-gradient-to-r from-emerald-500 to-teal-500", 
    text: "text-white", 
    label: "REXTRA CLUB" 
  },
  "Trial Club": { 
    bg: "bg-gradient-to-r from-violet-500 to-purple-500", 
    text: "text-white", 
    label: "TRIAL CLUB" 
  },
  "Non-Club": { 
    bg: "bg-slate-500", 
    text: "text-white", 
    label: "NON CLUB" 
  },
};

export function CategoryBadge({ category, size = "default" }: { category: string; size?: "default" | "sm" }) {
  const config = categoryConfig[category as CategoryType] || categoryConfig["Non-Club"];
  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-[9px]" 
    : "px-2.5 py-1 text-[10px]";
  
  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-md font-semibold ${config.bg} ${config.text} shadow-sm`}>
      {config.label}
    </span>
  );
}

// ============= VALIDITY STATUS BADGES =============
export type ValidityStatusType = "Active" | "Expiring" | "Expired";

const validityConfig: Record<ValidityStatusType, { 
  bg: string; 
  text: string;
  border: string;
}> = {
  "Active": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  "Expiring": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  "Expired": { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

export function ValidityBadge({ status }: { status: string }) {
  const config = validityConfig[status as ValidityStatusType] || validityConfig["Active"];
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.text} ${config.border} border`}>
      {status === "Expiring" ? "Segera Berakhir" : status === "Expired" ? "Expired" : "Aktif"}
    </span>
  );
}

// ============= TIMELINE EVENT ICONS =============
export const getTimelineEventStyle = (status: string) => {
  if (status.includes("gagal") || status.includes("Gagal")) {
    return { icon: <XCircle className="h-4 w-4" />, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
  }
  if (status.includes("kadaluarsa") || status.includes("Expired") || status.includes("dibatalkan") || status.includes("Dibatalkan")) {
    return { icon: <AlertCircle className="h-4 w-4" />, color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" };
  }
  if (status.includes("berhasil") || status.includes("diaktifkan") || status.includes("diberikan") || status.includes("diperbarui") || status.includes("diperpanjang")) {
    return { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" };
  }
  if (status.includes("dibuat") || status.includes("menunggu")) {
    return { icon: <Clock className="h-4 w-4" />, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200" };
  }
  return { icon: <Clock className="h-4 w-4" />, color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" };
};
