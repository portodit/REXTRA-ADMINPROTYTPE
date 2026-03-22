import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UserListTab } from "@/components/membership/riwayat/UserListTab";
import { TransaksiTab } from "@/components/membership/riwayat/TransaksiTab";

type DemoState = "loading" | "data" | "empty" | "error";

export default function MembershipRiwayatLangganan() {
  const [activeTab, setActiveTab] = useState("users");
  const [demoState] = useState<DemoState>("data");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/membership/fitur-hak-akses">Membership</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Riwayat Langganan</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Riwayat Langganan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau kondisi membership pengguna dan jejak perubahan statusnya.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto w-full justify-start">
            <TabsTrigger
              value="users"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Daftar Pengguna
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Riwayat Transaksi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UserListTab demoState={demoState} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <TransaksiTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
