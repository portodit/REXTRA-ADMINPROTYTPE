import { AppSidebar } from '@/components/layout/AppSidebar'
import { TopNavbar } from '@/components/layout/TopNavbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopNavbar className="sticky top-0 z-30" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
