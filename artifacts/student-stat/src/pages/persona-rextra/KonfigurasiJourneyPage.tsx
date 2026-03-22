import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KonfigurasiJourneyTab } from "@/components/persona-rextra/KonfigurasiJourneyTab";
import { JourneyPenggunaTab } from "@/components/persona-rextra/journey-pengguna/JourneyPenggunaTab";

export default function KonfigurasiJourneyPage() {
  return (
    <DashboardLayout>
      <Tabs defaultValue="konfigurasi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="konfigurasi">Konfigurasi Journey</TabsTrigger>
          <TabsTrigger value="journey-pengguna">Journey Pengguna</TabsTrigger>
        </TabsList>
        <TabsContent value="konfigurasi">
          <KonfigurasiJourneyTab />
        </TabsContent>
        <TabsContent value="journey-pengguna">
          <JourneyPenggunaTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
