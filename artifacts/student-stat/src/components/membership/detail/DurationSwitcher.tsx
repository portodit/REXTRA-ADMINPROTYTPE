import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PlanDuration, DurationMonth } from "./types";
import { DURATION_LABELS } from "./types";

interface Props {
  durations: PlanDuration[];
  selectedDuration: DurationMonth | null;
  onSelect: (month: DurationMonth) => void;
}

export function DurationSwitcher({ durations, selectedDuration, onSelect }: Props) {
  const activeDurations = durations.filter((d) => d.isActive);

  if (activeDurations.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">Durasi konfigurasi</label>
      <Select
        value={selectedDuration ? String(selectedDuration) : undefined}
        onValueChange={(v) => onSelect(Number(v) as DurationMonth)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Pilih durasi…" />
        </SelectTrigger>
        <SelectContent>
          {activeDurations.map((d) => (
            <SelectItem key={d.id} value={String(d.durationMonths)}>
              {DURATION_LABELS[d.durationMonths]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">Pengaturan di tab ini hanya berlaku untuk durasi yang dipilih.</p>
    </div>
  );
}
