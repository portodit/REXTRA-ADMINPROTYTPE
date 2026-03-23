import { AppSidebar } from './AppSidebar'
import { TopNavbar } from './TopNavbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopNavbar className="sticky top-0 z-30" onMenuClick={() => {}} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
