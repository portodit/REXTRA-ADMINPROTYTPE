import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface ExpertDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedbackId: string | null;
  expertName: string | null;
  onConfirm: () => void;
}

export function ExpertDeleteDialog({
  open,
  onOpenChange,
  feedbackId,
  expertName,
  onConfirm,
}: ExpertDeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg">
              Hapus Feedback Expert
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-2">
            <p>
              Apakah Anda yakin ingin menghapus feedback dari{" "}
              <span className="font-semibold text-foreground">{expertName}</span>?
            </p>
            <p className="text-xs text-muted-foreground">
              ID: <span className="font-mono">{feedbackId}</span>
            </p>
            <p className="text-sm text-destructive/80 mt-2">
              Tindakan ini tidak dapat dibatalkan. Data feedback akan dihapus secara permanen.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="mt-0">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
