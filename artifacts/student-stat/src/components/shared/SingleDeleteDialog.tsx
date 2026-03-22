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
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SingleDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

export function SingleDeleteDialog({ 
  open, 
  onOpenChange, 
  userName = "Pengguna" 
}: SingleDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    // Simulate deletion
    setTimeout(() => {
      toast({
        title: "Data berhasil dihapus",
        description: `Data tes ${userName} telah dihapus.`,
      });
      setIsDeleting(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      setIsDeleting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card border-border shadow-custom-xl animate-scale-in">
        <DialogHeader className="space-y-4 pb-4 border-b border-border">
          {/* Mascot Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <div className="relative">
                  <Trash2 className="h-10 w-10 text-destructive" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
                    <AlertTriangle className="h-2.5 w-2.5 text-destructive-foreground" />
                  </div>
                </div>
              </div>
              <div className="absolute -left-1 top-1/2 w-2 h-2 rounded-full bg-destructive/20 animate-pulse" />
              <div className="absolute -right-2 top-1/3 w-1.5 h-1.5 rounded-full bg-destructive/30 animate-pulse delay-75" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <DialogTitle className="text-lg font-semibold text-foreground">
              Hapus Data Hasil Tes
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Apakah Anda yakin akan menghapus data tes{" "}
              <span className="font-semibold text-foreground">{userName}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 h-10 bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                Menghapus...
              </span>
            ) : (
              "Ya, Hapus"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
