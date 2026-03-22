import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Check, Power, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { MembershipPackage } from "./MembershipStatusCard";

/* ─── Save Changes Modal (H1) ─── */

interface ChangeSummary {
  field: string;
  oldValue: string;
  newValue: string;
}

interface SaveChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: ChangeSummary[];
}

export function SaveChangesModal({ isOpen, onClose, onConfirm, changes }: SaveChangesModalProps) {
  const [checked, setChecked] = useState(false);
  const hasChanges = changes.length > 0;

  useEffect(() => {
    if (!isOpen) setChecked(false);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <DialogTitle>Simpan perubahan paket?</DialogTitle>
              <DialogDescription className="mt-1">
                Perubahan ini berlaku untuk pembelian/renew berikutnya dan tidak mempengaruhi periode berjalan.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {hasChanges ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Ringkasan perubahan:</p>
              <ul className="space-y-1.5">
                {changes.map((c, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>
                      {c.field}: <span className="line-through">{c.oldValue}</span>{" "}
                      <span className="text-foreground font-medium">→ {c.newValue}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Tidak ada perubahan.</p>
          )}

          {hasChanges && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                id="confirm-save"
                checked={checked}
                onCheckedChange={(v) => setChecked(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="confirm-save" className="text-sm font-normal cursor-pointer leading-relaxed">
                Saya memahami dampaknya.
              </Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={onConfirm} disabled={!hasChanges || !checked}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Deactivate Modal (H2) ─── */

interface DeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activeUsers: number;
}

export function DeactivateModal({ isOpen, onClose, onConfirm, activeUsers }: DeactivateModalProps) {
  const [checked, setChecked] = useState(false);
  const isHeavy = activeUsers > 0;

  useEffect(() => {
    if (!isOpen) setChecked(false);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <Power className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Nonaktifkan paket ini?</DialogTitle>
              <DialogDescription className="mt-1">
                {isHeavy
                  ? "Menonaktifkan menghentikan pembelian/renew baru. User yang sedang aktif tetap berjalan sampai masa aktif berakhir (expiry)."
                  : "Paket tidak akan bisa dibeli atau di-renew setelah dinonaktifkan."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isHeavy && (
          <div className="py-2">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                id="confirm-deactivate"
                checked={checked}
                onCheckedChange={(v) => setChecked(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="confirm-deactivate" className="text-sm font-normal cursor-pointer leading-relaxed">
                Saya memahami dampaknya.
              </Label>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isHeavy && !checked}
          >
            Nonaktifkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Activate Modal (H3) ─── */

interface ActivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isComplete: boolean;
}

export function ActivateModal({ isOpen, onClose, onConfirm, isComplete }: ActivateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <Play className="h-5 w-5 text-success" />
            </div>
            <div>
              <DialogTitle>Aktifkan paket ini?</DialogTitle>
              <DialogDescription className="mt-1">
                Paket akan tersedia untuk pembelian/renew.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={onConfirm} disabled={!isComplete}>
            Aktifkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
