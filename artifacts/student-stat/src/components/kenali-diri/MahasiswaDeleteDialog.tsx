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

interface MahasiswaDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedbackId: string | null;
  userName: string | null;
  onConfirm: () => void;
}

export function MahasiswaDeleteDialog({
  open,
  onOpenChange,
  feedbackId,
  userName,
  onConfirm,
}: MahasiswaDeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-7 w-7 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Hapus Feedback Mahasiswa?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Anda akan menghapus feedback{" "}
            <span className="font-mono font-medium text-foreground">
              {feedbackId}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-foreground">{userName}</span>.
            <br />
            <span className="text-destructive">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
