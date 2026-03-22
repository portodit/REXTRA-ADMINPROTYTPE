import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./PersonaBadge";
import type { Mission } from "./mockData";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Copy, Power, Trash2 } from "lucide-react";

interface MissionTableProps {
  missions: Mission[];
  onEdit: (mission: Mission) => void;
  onDuplicate: (mission: Mission) => void;
  onDeactivate: (mission: Mission) => void;
  onDelete: (mission: Mission) => void;
  onUserClick: (mission: Mission) => void;
}

export function MissionTable({ missions, onEdit, onDuplicate, onDeactivate, onDelete, onUserClick }: MissionTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-12 text-xs">#</TableHead>
            <TableHead className="text-xs">Kode Misi</TableHead>
            <TableHead className="text-xs">Nama Misi</TableHead>
            <TableHead className="text-xs">Fitur Tujuan</TableHead>
            <TableHead className="text-xs">Kategori</TableHead>
            <TableHead className="text-xs">Reward</TableHead>
            <TableHead className="text-xs">Auto-pass</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Pengguna</TableHead>
            <TableHead className="text-xs w-12">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.map(m => (
            <TableRow key={m.id} className="text-sm">
              <TableCell className="text-muted-foreground">{m.no}</TableCell>
              <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{m.code}</code></TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">{m.name}</TableCell>
              <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded-full">{m.fitur}</span></TableCell>
              <TableCell><StatusBadge label={m.kategori} /></TableCell>
              <TableCell className="text-green-700 font-medium text-xs">+{m.reward}</TableCell>
              <TableCell>
                <span className={`text-xs font-medium ${m.autoPass ? "text-emerald-700" : "text-muted-foreground"}`}>
                  {m.autoPass ? "Ya" : "Tidak"}
                </span>
              </TableCell>
              <TableCell><StatusBadge label={m.status} /></TableCell>
              <TableCell>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => onUserClick(m)}>
                  {m.usedByUsers > 0 ? `${m.usedByUsers} user` : "—"}
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(m)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(m)}><Copy className="h-3.5 w-3.5 mr-2" />Duplikat</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeactivate(m)}><Power className="h-3.5 w-3.5 mr-2" />Nonaktifkan</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(m)} className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
