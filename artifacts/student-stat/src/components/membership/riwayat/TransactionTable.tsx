import { Transaction } from "./types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { PaymentStatusBadge, TransactionTypeBadge, TierBadge } from "./StatusBadges";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetail: (transaction: Transaction) => void;
}

export function TransactionTable({ transactions, onViewDetail }: TransactionTableProps) {
  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/30">
              <TableHead className="min-w-[100px] font-semibold text-foreground">Waktu</TableHead>
              <TableHead className="min-w-[130px] font-semibold text-foreground">Transaksi ID</TableHead>
              <TableHead className="min-w-[120px] font-semibold text-foreground">Pengguna</TableHead>
              <TableHead className="min-w-[140px] font-semibold text-foreground">Jenis Transaksi</TableHead>
              <TableHead className="min-w-[140px] font-semibold text-foreground">Detail Status</TableHead>
              <TableHead className="min-w-[70px] font-semibold text-foreground">Durasi</TableHead>
              <TableHead className="min-w-[110px] text-right font-semibold text-foreground">Total Bayar</TableHead>
              <TableHead className="min-w-[110px] font-semibold text-foreground">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((trx) => (
              <TableRow 
                key={trx.id} 
                className="cursor-pointer hover:bg-sky-50/50 transition-colors"
                onClick={() => onViewDetail(trx)}
              >
                {/* Waktu - now first */}
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {format(trx.date, "dd MMM yy", { locale: id })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(trx.date, "HH:mm", { locale: id })}
                    </p>
                  </div>
                </TableCell>

                {/* Transaksi ID - now second */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                      {trx.referenceId}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleCopy(trx.referenceId, e)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>

                {/* Pengguna - just name */}
                <TableCell>
                  <p className="font-medium text-sm">{trx.user.name}</p>
                </TableCell>

                {/* Jenis Transaksi */}
                <TableCell>
                  <TransactionTypeBadge eventType={trx.eventType} />
                </TableCell>

                {/* Detail Status - tier change */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <TierBadge tier={trx.statusBefore} size="sm" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <TierBadge tier={trx.statusAfter} size="sm" />
                  </div>
                </TableCell>

                {/* Durasi */}
                <TableCell>
                  <span className="text-sm">{trx.duration}</span>
                </TableCell>

                {/* Total Bayar */}
                <TableCell className="text-right">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm">{formatCurrency(trx.totalPaid)}</p>
                    {trx.promoCode && (
                      <p className="text-[10px] text-emerald-600 font-medium">{trx.promoCode}</p>
                    )}
                  </div>
                </TableCell>

                {/* Status Pembayaran */}
                <TableCell>
                  <PaymentStatusBadge status={trx.paymentStatus} />
                </TableCell>

                {/* Aksi */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(trx);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}