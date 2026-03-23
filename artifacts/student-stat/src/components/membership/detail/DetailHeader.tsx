import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Save, Play, Power, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { PlanDetail } from "./types";

import emblemStarter from "@/assets/emblem-starter.png";
import emblemBasic from "@/assets/emblem-basic.png";
import emblemPro from "@/assets/emblem-pro.png";
import emblemMax from "@/assets/emblem-max.png";

const emblemMap: Record<string, string> = {
  starter: emblemStarter.src,
  basic: emblemBasic.src,
  pro: emblemPro.src,
  max: emblemMax.src,
};

const statusConfig = {
  draft: { label: "Draft", dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground" },
  aktif: { label: "Aktif", dot: "bg-primary", bg: "bg-primary/10", text: "text-primary" },
  nonaktif: { label: "Nonaktif", dot: "bg-destructive", bg: "bg-destructive/10", text: "text-destructive" },
};

const planDescriptions: Record<string, string> = {
  standard: "Status default untuk user yang tidak berlangganan atau trial-nya habis.",
  starter: "Paket trial gratis untuk user baru dengan durasi terbatas.",
  basic: "Paket berlangganan entry-level Rextra Club.",
  pro: "Paket berlangganan mid-tier Rextra Club.",
  max: "Paket berlangganan premium Rextra Club.",
};

interface Props {
  plan: PlanDetail;
  isComplete: boolean;
  hasChanges: boolean;
  onBack: () => void;
  onSaveDraft: () => void;
  onSaveChanges: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}

export function DetailHeader({ plan, isComplete, hasChanges, onBack, onSaveDraft, onSaveChanges, onActivate, onDeactivate }: Props) {
  const [calloutOpen, setCalloutOpen] = useState(false);
  const sc = statusConfig[plan.status];
  const emblem = emblemMap[plan.emblemKey] || emblemStarter.src;
  const isPaid = plan.category === "paid";
  const isStarter = plan.id === "starter";
  const isStandard = plan.id === "standard";

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }) + " WIB";
    } catch {
      return iso;
    }
  };

  const clubLabel = isPaid ? "REXTRA CLUB" : isStarter ? "TRIAL CLUB" : "NON CLUB";

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/membership/fitur-hak-akses">Membership</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/membership/status">Status Membership</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{plan.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title row */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-10 w-10 mt-1">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src={emblem} alt={plan.name} className="h-14 w-14 object-contain shrink-0" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{plan.name}</h1>
            <Badge variant="secondary" className="rounded-md text-xs font-semibold px-2.5 py-0.5">
              {plan.tierLabel || clubLabel}
            </Badge>
            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold", sc.bg, sc.text)}>
              <span className={cn("w-2 h-2 rounded-full", sc.dot, plan.status === "aktif" && "animate-pulse")} />
              {sc.label}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {planDescriptions[plan.id] || plan.description || "Konfigurasi paket membership."}
          </p>
          {plan.updatedAt && (
            <p className="text-xs text-muted-foreground">
              Terakhir diperbarui {formatDate(plan.updatedAt)} oleh {plan.updatedBy}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap pt-1">
          {plan.status === "draft" && (
            <>
              <Button variant="outline" size="sm" onClick={onSaveDraft} disabled={!hasChanges} className="gap-2 h-9">
                <Save className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Simpan Draft</span>
              </Button>
              <Button size="sm" onClick={onActivate} disabled={!isComplete} className="gap-2 h-9">
                <Play className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Aktifkan Plan</span>
              </Button>
            </>
          )}
          {plan.status === "aktif" && (
            <>
              <Button variant="success" size="sm" onClick={onSaveChanges} disabled={!hasChanges} className="gap-2 h-9">
                <Save className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Simpan Perubahan</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={onDeactivate} className="gap-2 h-9">
                <Power className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nonaktifkan</span>
              </Button>
            </>
          )}
          {plan.status === "nonaktif" && (
            <Button size="sm" onClick={onActivate} disabled={!isComplete} className="gap-2 h-9">
              <Play className="h-3.5 w-3.5" />
              Aktifkan Plan
            </Button>
          )}
        </div>
      </div>

      {/* Callout — only for paid plans */}
      {isPaid && (
        <Collapsible open={calloutOpen} onOpenChange={setCalloutOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left py-2.5 px-4 rounded-xl bg-muted/50 hover:bg-muted border border-border/50">
              <Info className="h-4 w-4 shrink-0" />
              <span className="font-medium">Catatan Penting</span>
              <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", calloutOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 px-4 py-3 bg-muted/30 rounded-xl text-sm text-muted-foreground space-y-1.5 border border-border/30">
              <p>• Aktifkan durasi terlebih dahulu. Semua tab mengikuti durasi yang aktif.</p>
              <p>• Perubahan pada plan Aktif berlaku untuk pembelian/renew berikutnya dan tidak mempengaruhi periode berjalan.</p>
              <p>• Nonaktifkan Plan menghentikan pembelian/renew baru, tetapi user existing tetap sampai expiry.</p>
              <p>• Reward poin, harga, dan token dapat berbeda per durasi (1/3/6/12 bulan).</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
