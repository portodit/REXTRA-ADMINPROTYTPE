import { MemberUser } from "./types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { CategoryBadge, TierBadge } from "./StatusBadges";

interface UserTableViewProps {
  users: MemberUser[];
  onViewDetail: (user: MemberUser) => void;
}

export function UserTableView({ users, onViewDetail }: UserTableViewProps) {
  const getStatusLabel = (user: MemberUser) => {
    if (user.validityStatus === "Berakhir") return { text: "Berakhir", className: "text-destructive" };
    if (user.validityStatus === "Akan berakhir") return { text: "Akan berakhir", className: "text-warning" };
    return { text: "Aktif", className: "text-success" };
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">User</TableHead>
            <TableHead className="min-w-[100px]">Club</TableHead>
            <TableHead className="min-w-[80px]">Tier/Plan</TableHead>
            <TableHead className="min-w-[100px]">Bergabung</TableHead>
            <TableHead className="min-w-[100px]">Berakhir</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const status = getStatusLabel(user);
            return (
              <TableRow 
                key={user.id} 
                className="cursor-pointer hover:bg-primary/5"
                onClick={() => onViewDetail(user)}
              >
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs font-mono text-muted-foreground">{user.userId}</p>
                  </div>
                </TableCell>
                <TableCell><CategoryBadge category={user.category} size="sm" /></TableCell>
                <TableCell><TierBadge tier={user.tier} /></TableCell>
                <TableCell className="text-sm">
                  {user.startDate.toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="text-sm">
                  {user.endDate ? user.endDate.toLocaleDateString("id-ID") : "-"}
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${status.className}`}>
                    {status.text}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(user);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
