'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronLeft,
  X,
  User,
  BarChart2,
  GraduationCap,
  Heart,
  Building2,
  FileText,
  Trophy,
  DollarSign,
  BookOpen,
  Crown,
  Coins,
  Menu,
} from 'lucide-react'

const menuData = [
  {
    category: 'Mahasiswa',
    items: [
      { label: 'Akun Mahasiswa', icon: User, href: '/akun-mahasiswa' },
      { label: 'Persona REXTRA', icon: BarChart2, href: '/persona-rextra' },
      { label: 'Pendidikan', icon: GraduationCap, href: '/pendidikan' },
      {
        label: 'Membership',
        icon: Crown,
        href: '#',
        children: [
          { label: 'Fitur & Hak Akses', href: '/membership/fitur-hak-akses' },
          { label: 'Status Membership', href: '/membership/status' },
          { label: 'Riwayat Langganan', href: '/membership/riwayat-langganan' },
          { label: 'Promo & Diskon', href: '/membership/promo-diskon' },
          { label: 'Pengaturan', href: '/membership/pengaturan' },
        ],
      },
      {
        label: 'Sistem Token',
        icon: Coins,
        href: '#',
        children: [
          { label: 'Ikhtisar Token', href: '/sistem-token/ikhtisar' },
          { label: 'Pengadaan Token', href: '/sistem-token/pengadaan' },
          { label: 'Ledger Token', href: '/sistem-token/ledger' },
        ],
      },
      {
        label: 'Kenali Diri',
        icon: Heart,
        href: '#',
        children: [
          { label: 'Master Data', href: '/kenali-diri/master-data' },
          { label: 'Hasil Tes', href: '/kenali-diri/hasil-tes' },
          { label: 'Umpan Balik', href: '/kenali-diri/umpan-balik' },
        ],
      },
      {
        label: 'Kamus Karier',
        icon: BookOpen,
        href: '#',
        children: [
          { label: 'Master Data', href: '/kamus-karier/master-data' },
          { label: 'Kecocokan Profesi', href: '/kamus-karier/kecocokan-profesi' },
          { label: 'Statistik', href: '/kamus-karier/statistik' },
        ],
      },
    ],
  },
  {
    category: 'Perusahaan',
    items: [
      { label: 'Profil Perusahaan', icon: Building2, href: '/profil-perusahaan' },
      { label: 'Lowongan Kerja', icon: FileText, href: '/lowongan-kerja' },
    ],
  },
  {
    category: 'Performa',
    items: [
      { label: 'Capaian Pengguna', icon: Trophy, href: '/capaian-pengguna' },
      { label: 'Capaian Keuangan', icon: DollarSign, href: '/capaian-keuangan' },
      { label: 'Visualisasi Performa', icon: BarChart2, href: '/visualisasi-performa' },
    ],
  },
]

function SidebarContent({
  isOpen,
  onClose,
  isMobile = false,
}: {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname() ?? ''

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label],
    )
  }

  useEffect(() => {
    menuData.forEach(section => {
      section.items.forEach(item => {
        if (item.children) {
          const isChildActive = item.children.some(
            child => pathname === child.href || pathname.startsWith(child.href + '/'),
          )
          if (isChildActive) {
            setExpandedMenus(prev => (prev.includes(item.label) ? prev : [...prev, item.label]))
          }
        }
      })
    })
  }, [pathname])

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div
        className={cn(
          'h-20 flex items-center mb-2 border-b border-[#B5B7B8] shrink-0',
          isOpen && !isMobile
            ? 'justify-between px-6'
            : isMobile
              ? 'justify-between px-6'
              : 'justify-center px-0',
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap min-w-0">
          {isOpen || isMobile ? (
            <img src="/images/dashboard/logo-rextra.webp" alt="Rextra Full Logo" className="h-8 object-contain transition-opacity duration-300" />
          ) : (
            <img src="/images/dashboard/logo-mini.svg" alt="Rextra Icon" className="w-9 h-9 object-contain transition-opacity duration-300" />
          )}
        </div>
        {(isOpen || isMobile) && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
            {isMobile ? <X size={24} /> : <ChevronLeft size={24} />}
          </button>
        )}
      </div>

      {/* MENU LIST */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-10">
        {menuData.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="gap-1">
              {section.items.map(item => {
                const hasChildren = item.children && item.children.length > 0
                const isMenuExpanded = expandedMenus.includes(item.label)
                const isSelfActive = pathname === item.href
                const isChildActive = item.children?.some(
                  c => pathname === c.href || pathname.startsWith(c.href + '/'),
                )
                const isParentActive = isSelfActive || isChildActive
                const Icon = item.icon

                return (
                  <div key={item.label}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={cn(
                          'flex items-center w-full p-3 rounded-2xl transition-all duration-200 group relative',
                          isOpen || isMobile ? 'justify-between' : 'justify-center flex-col gap-1',
                          isParentActive && (isOpen || isMobile)
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50',
                          isParentActive && !isOpen && !isMobile ? 'bg-blue-50/50 text-blue-900' : '',
                        )}
                      >
                        <div className={cn('flex items-center gap-4', !isOpen && !isMobile && 'flex-col gap-0')}>
                          <Icon
                            size={24}
                            className={cn(isParentActive ? 'text-blue-800' : 'text-gray-500 group-hover:text-gray-700')}
                            strokeWidth={1.5}
                          />
                          <span
                            className={cn(
                              'whitespace-nowrap transition-all duration-200 font-medium font-poppins text-[16px]',
                              isOpen || isMobile ? 'opacity-100' : 'opacity-0 w-0 h-0 hidden',
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                        {(isOpen || isMobile) && (
                          <ChevronDown
                            size={18}
                            className={cn('transition-transform duration-200 text-gray-400', isMenuExpanded ? 'rotate-180' : '')}
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center w-full p-3 rounded-2xl transition-all duration-200 group relative',
                          isOpen || isMobile ? 'justify-start' : 'justify-center flex-col gap-1',
                          isSelfActive
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50',
                        )}
                      >
                        <div className={cn('flex items-center gap-4', !isOpen && !isMobile && 'flex-col gap-0')}>
                          <Icon
                            size={24}
                            className={cn(isSelfActive ? 'text-blue-800' : 'text-gray-500 group-hover:text-gray-700')}
                            strokeWidth={1.5}
                          />
                          <span
                            className={cn(
                              'whitespace-nowrap transition-all duration-200 font-medium font-poppins text-[16px]',
                              isOpen || isMobile ? 'opacity-100' : 'opacity-0 w-0 h-0 hidden',
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    )}

                    {/* Sub Menu */}
                    {hasChildren && (isOpen || isMobile) && (
                      <div
                        className={cn(
                          'grid transition-all duration-300 ease-in-out overflow-hidden',
                          isMenuExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0',
                        )}
                      >
                        <div className="min-h-0 relative">
                          <div className="absolute left-[35.5px] top-0 bottom-4 w-px bg-gray-200 z-0" />
                          {item.children?.map((subItem, subIdx) => {
                            const isSubActive =
                              pathname === subItem.href ||
                              (subItem.href !== '/' && pathname.startsWith(subItem.href + '/'))
                            return (
                              <Link
                                key={subIdx}
                                href={subItem.href}
                                className="relative flex items-center py-2 pl-16 text-sm hover:text-blue-600 group/sub w-full"
                              >
                                <div
                                  className={cn(
                                    'absolute left-9 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-all z-10',
                                    isSubActive
                                      ? 'border-blue-600 bg-blue-600'
                                      : 'border-gray-300 bg-white group-hover/sub:border-blue-400',
                                  )}
                                />
                                <span
                                  className={cn(
                                    isSubActive ? 'font-medium text-blue-900' : 'text-gray-500',
                                  )}
                                >
                                  {subItem.label}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {(isOpen || isMobile) && (
        <div className="p-4 border-t border-[#B5B7B8]">
          <p className="text-xs text-gray-400 text-center">© 2025 REXTRA Admin</p>
        </div>
      )}
    </div>
  )
}

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname() ?? ''

  const toggleSidebar = () => setIsOpen(v => !v)
  const openMobile = () => setMobileOpen(true)
  const closeMobile = () => setMobileOpen(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={cn(
          'hidden md:flex flex-col',
          'shadow-[3px_9px_7px_7px_rgba(77,77,86,0.04)]',
          'bg-white border-r border-[#B5B7B8] transition-all duration-300 ease-in-out',
          isOpen ? 'w-[318px]' : 'w-[88px] cursor-pointer',
        )}
        onClick={!isOpen ? toggleSidebar : undefined}
      >
        <SidebarContent isOpen={isOpen} onClose={toggleSidebar} isMobile={false} />
      </aside>

      {/* MOBILE: Hamburger */}
      <button
        onClick={openMobile}
        className={cn(
          'md:hidden fixed top-4 left-4 z-40',
          'bg-white border border-[#B5B7B8] rounded-xl p-2',
          'shadow-md text-gray-600 hover:text-gray-900 transition-colors',
        )}
        aria-label="Buka Menu"
      >
        <Menu size={22} />
      </button>

      {/* MOBILE: Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      {/* MOBILE: Drawer */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 h-full z-50',
          'bg-white shadow-2xl w-[300px]',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarContent isOpen={true} onClose={closeMobile} isMobile={true} />
      </aside>
    </>
  )
}
