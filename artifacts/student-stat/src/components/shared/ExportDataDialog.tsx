import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download, CalendarIcon, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ExportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const testCategories = [
  { value: "all", label: "Semua Kategori" },
  { value: "career-profile", label: "Tes Profil Karier" },
];

const testStatuses = [
  { value: "completed", label: "Selesai" },
  { value: "in-progress", label: "Sedang Berjalan" },
  { value: "stopped", label: "Dihentikan" },
];

export function ExportDataDialog({ open, onOpenChange }: ExportDataDialogProps) {
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [exportAllData, setExportAllData] = useState(false);

  const handleExport = () => {
    if (!category) {
      toast({
        title: "Pilih kategori tes",
        description: "Silakan pilih kategori tes yang ingin diekspor.",
        variant: "destructive",
      });
      return;
    }

    if (!status) {
      toast({
        title: "Pilih status tes",
        description: "Silakan pilih status tes yang ingin diekspor.",
        variant: "destructive",
      });
      return;
    }

    if (!exportAllData && (!startDate || !endDate)) {
      toast({
        title: "Pilih rentang waktu",
        description: "Silakan pilih rentang waktu atau centang 'Ekspor seluruh data'.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mengunduh data...",
      description: "Data hasil tes sedang diproses untuk diunduh.",
    });

    // Simulate export
    setTimeout(() => {
      toast({
        title: "Berhasil!",
        description: "Data berhasil diekspor.",
      });
      onOpenChange(false);
    }, 1500);
  };

  const resetForm = () => {
    setCategory("");
    setStatus("");
    setStartDate(undefined);
    setEndDate(undefined);
    setExportAllData(false);
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border shadow-custom-xl animate-scale-in">
        <DialogHeader className="space-y-3 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Ekspor Data
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Ekspor riwayat tes mahasiswa pada fitur Kenali Diri
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Category & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-foreground">
                Kategori Tes
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger 
                  id="category"
                  className="w-full h-11 bg-background border-input hover:border-primary/50 transition-colors"
                >
                  <SelectValue placeholder="Pilih kategori tes" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border shadow-custom-lg">
                  {testCategories.map((cat) => (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className="cursor-pointer hover:bg-accent focus:bg-accent"
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-foreground">
                Status Tes
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger 
                  id="status"
                  className="w-full h-11 bg-background border-input hover:border-primary/50 transition-colors"
                >
                  <SelectValue placeholder="Pilih status tes" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border shadow-custom-lg">
                  {testStatuses.map((stat) => (
                    <SelectItem 
                      key={stat.value} 
                      value={stat.value}
                      className="cursor-pointer hover:bg-accent focus:bg-accent"
                    >
                      {stat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Rentang Waktu
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="allData"
                  checked={exportAllData}
                  onCheckedChange={(checked) => setExportAllData(checked as boolean)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label 
                  htmlFor="allData" 
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  Ekspor seluruh data
                </Label>
              </div>
            </div>

            <div className={cn(
              "grid grid-cols-2 gap-3 transition-opacity duration-200",
              exportAllData && "opacity-50 pointer-events-none"
            )}>
              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dari</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal bg-background border-input hover:border-primary/50",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "MMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih bulan</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border shadow-custom-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Sampai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal bg-background border-input hover:border-primary/50",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "MMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih bulan</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border shadow-custom-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-start pt-4 mt-2 border-t border-border">
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Unduh Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
