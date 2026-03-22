import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonaBadge, StatusBadge } from "./PersonaBadge";
import { MOCK_USERS_ON_MISSION, type Mission } from "./mockData";

interface Props {
  open: boolean;
  onClose: () => void;
  mission: Mission | null;
}

export function UserListDrawer({ open, onClose, mission }: Props) {
  if (!mission) return null;

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Daftar Pengguna — {mission.fitur}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="text-xs text-muted-foreground">
            Misi: <strong>{mission.code}</strong> · Persona: Pathfinder · Urutan: {mission.no} · Total: {mission.usedByUsers} user
          </div>

          <div className="flex gap-2">
            <Input placeholder="Cari user..." className="h-8 text-xs" />
            <Select defaultValue="semua">
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="belum">Belum Mulai</SelectItem>
                <SelectItem value="berjalan">Berjalan</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Nama</TableHead>
                <TableHead>Persona Awal</TableHead>
                <TableHead>Status Misi</TableHead>
                <TableHead>Selesai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_USERS_ON_MISSION.map((u, i) => (
                <TableRow key={i} className="text-xs">
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell><PersonaBadge label={u.personaAwal} /></TableCell>
                  <TableCell><StatusBadge label={u.statusMisi} /></TableCell>
                  <TableCell className="text-muted-foreground">{u.tanggalSelesai}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
