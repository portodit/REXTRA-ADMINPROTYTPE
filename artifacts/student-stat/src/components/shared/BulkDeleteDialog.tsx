import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataCount?: number;
}

export function BulkDeleteDialog({ 
  open, 
  onOpenChange, 
  dataCount = 2000 
}: BulkDeleteDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (!isConfirmed) {
      toast({
        title: "Konfirmasi diperlukan",
        description: "Silakan centang checkbox konfirmasi untuk melanjutkan.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    // Simulate deletion
    setTimeout(() => {
      toast({
        title: "Data berhasil dihapus",
        description: `${dataCount.toLocaleString('id-ID')} data tes telah dihapus secara permanen.`,
      });
      setIsDeleting(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      setIsConfirmed(false);
      setIsDeleting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border shadow-custom-xl animate-scale-in">
        <DialogHeader className="space-y-4 pb-4 border-b border-border">
          {/* Mascot Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Trash bin mascot illustration placeholder */}
              <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                <div className="relative">
                  <Trash2 className="h-12 w-12 text-destructive" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                    <AlertTriangle className="h-3 w-3 text-destructive-foreground" />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -left-2 top-1/2 w-3 h-3 rounded-full bg-destructive/20 animate-pulse" />
              <div className="absolute -right-3 top-1/3 w-2 h-2 rounded-full bg-destructive/30 animate-pulse delay-75" />
              <div className="absolute left-1/4 -bottom-1 w-2 h-2 rounded-full bg-destructive/25 animate-pulse delay-150" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Hapus Data Hasil Tes (Massal)
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Apakah Anda yakin akan menghapus sebanyak{" "}
              <span className="font-semibold text-destructive">
                {dataCount.toLocaleString('id-ID')}
              </span>{" "}
              data tes Kenali Diri?
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Confirmation Checkbox */}
        <div className="py-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <Checkbox
              id="confirmDelete"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="mt-0.5 border-destructive/50 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
            />
            <Label 
              htmlFor="confirmDelete" 
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed hover:text-foreground transition-colors"
            >
              Saya mengerti bahwa data ini akan dihapus permanen dan tidak dapat dikembalikan.
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 h-11 bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            disabled={isDeleting}
          >
            Tidak, Pertahankan
          </Button>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="flex-1 h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                Menghapus...
              </span>
            ) : (
              "Iya, Hapus Data"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
