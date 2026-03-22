import { Transaction } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, FileText, Receipt, Coins, Gift, 
  CreditCard, Wallet, Building2, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { PaymentStatusBadge, TierBadge, getTimelineEventStyle } from "./StatusBadges";

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailDrawer({ transaction, open, onClose }: TransactionDetailDrawerProps) {
  if (!transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? "-" : "";
    return `${prefix}Rp ${Math.abs(value).toLocaleString("id-ID")}`;
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes("E-Wallet") || method.includes("QRIS")) return <Wallet className="h-5 w-5" />;
    if (method.includes("Bank") || method.includes("Virtual Account")) return <Building2 className="h-5 w-5" />;
    if (method.includes("Credit")) return <CreditCard className="h-5 w-5" />;
    return <CreditCard className="h-5 w-5" />;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col gap-0">
        {/* Header */}
        <SheetHeader className="p-5 pb-4 border-b border-border/50">
          <div className="space-y-3">
            <SheetTitle className="text-left text-lg font-semibold">Detail Transaksi</SheetTitle>
            
            {/* Transaction ID with copy */}
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                {transaction.referenceId}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-slate-100"
                onClick={() => handleCopy(transaction.referenceId)}
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              </Button>
            </div>

            {/* Status Badge + Date inline - USING SHARED COMPONENT */}
            <div className="flex items-center gap-3 flex-wrap">
              <PaymentStatusBadge status={transaction.paymentStatus} size="lg" />
              <span className="text-xs text-muted-foreground">
                {format(transaction.date, "EEEE, dd MMM yyyy • HH:mm", { locale: id })} WIB
              </span>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-5">
            {/* Ringkasan Transaksi */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Ringkasan Transaksi
              </h3>

              <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">User</p>
                    <p className="text-sm font-medium">{transaction.user.name}</p>
                    <p className="text-[11px] text-muted-foreground">{transaction.user.email}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">User ID</p>
                    <p className="text-xs font-mono text-slate-600">{transaction.user.userId}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Jenis Transaksi</p>
                    <p className="text-sm font-medium">{transaction.eventType}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Kategori</p>
                    <p className="text-sm font-medium">{transaction.category}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Status Perubahan</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <TierBadge tier={transaction.statusBefore} />
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <TierBadge tier={transaction.statusAfter} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Durasi</p>
                    <p className="text-sm font-medium">{transaction.duration}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Breakdown Harga */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Breakdown Harga
              </h3>

              <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga Dasar</span>
                  <span className="font-medium">{formatCurrency(transaction.basePrice)}</span>
                </div>
                
                {transaction.durationDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Diskon Durasi</span>
                    <span className="font-medium">-{formatCurrency(transaction.durationDiscount)}</span>
                  </div>
                )}
                
                {transaction.promoCode && transaction.promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Promo ({transaction.promoCode})</span>
                    <span className="font-medium">-{formatCurrency(transaction.promoDiscount)}</span>
                  </div>
                )}

                {transaction.adminFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span className="font-medium">+{formatCurrency(transaction.adminFee)}</span>
                  </div>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total Bayar</span>
                  <span className={`text-lg font-bold ${transaction.totalPaid < 0 ? "text-violet-600" : "text-foreground"}`}>
                    {formatCurrency(transaction.totalPaid)}
                  </span>
                </div>
              </div>
            </section>

            {/* Pembayaran */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Pembayaran
              </h3>
              
              <div className="space-y-4">
                {/* Payment Method */}
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/80">
                  <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{transaction.paymentMethod}</p>
                    {transaction.paymentGatewayRef && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className="text-[11px] font-mono text-slate-500 truncate">
                          {transaction.paymentGatewayRef}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 shrink-0 hover:bg-slate-200/50"
                          onClick={() => handleCopy(transaction.paymentGatewayRef!)}
                        >
                          <Copy className="h-2.5 w-2.5 text-slate-400" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modern Status Timeline */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Status Timeline
                    </p>
                  </div>
                  
                  <div className="p-4 space-y-0">
                    {transaction.paymentTimeline.map((item, index) => {
                      const isLast = index === transaction.paymentTimeline.length - 1;
                      const style = getTimelineEventStyle(item.status);
                      
                      return (
                        <div key={index} className="relative flex gap-3">
                          {/* Timeline line */}
                          {!isLast && (
                            <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-slate-200" />
                          )}
                          
                          {/* Icon with border */}
                          <div className={`relative z-10 h-8 w-8 rounded-full ${style.bg} ${style.border} border flex items-center justify-center shrink-0`}>
                            <span className={style.color}>{style.icon}</span>
                          </div>
                          
                          {/* Content */}
                          <div className={`flex-1 pb-4 ${isLast ? 'pb-0' : ''}`}>
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium text-slate-700`}>
                                {item.status}
                              </p>
                              <span className="text-[11px] text-slate-400 font-mono shrink-0 pt-0.5">
                                {item.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Benefit Diberikan */}
            {(transaction.tokenGiven !== 0 || transaction.pointsGiven !== 0) && (
              <section className="space-y-3">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Benefit Diberikan
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* Token */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3.5 border border-amber-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Coins className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-xs text-amber-700/80 font-medium">Token</span>
                    </div>
                    <p className={`text-xl font-bold ${transaction.tokenGiven < 0 ? 'text-red-600' : transaction.tokenGiven > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                      {transaction.tokenGiven > 0 ? '+' : ''}{transaction.tokenGiven}
                    </p>
                  </div>

                  {/* Poin */}
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-3.5 border border-violet-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Gift className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-xs text-violet-700/80 font-medium">Poin</span>
                    </div>
                    <p className={`text-xl font-bold ${transaction.pointsGiven < 0 ? 'text-red-600' : transaction.pointsGiven > 0 ? 'text-violet-700' : 'text-slate-400'}`}>
                      {transaction.pointsGiven > 0 ? '+' : ''}{transaction.pointsGiven.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Dokumen */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Dokumen
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start h-auto py-3 px-3.5 bg-white hover:bg-slate-50 border-slate-200">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-700">Invoice</p>
                    <p className="text-[10px] text-muted-foreground">Download PDF</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3 px-3.5 bg-white hover:bg-slate-50 border-slate-200">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center mr-3">
                    <Receipt className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-700">Receipt</p>
                    <p className="text-[10px] text-muted-foreground">Download PDF</p>
                  </div>
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
