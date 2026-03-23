import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoRextra from "@/assets/logo-rextra.png";
import {
  ChevronLeft,
  ChevronDown,
  X,
  User,
  Fingerprint,
  GraduationCap,
  Users,
  Brain,
  FileText,
  Building2,
  Trophy,
  DollarSign,
  BarChart3,
  BookOpen,
  Crown,
  Coins,
  Settings,
  Heart,
  Menu,
} from "lucide-react";

// ─── Menu Data ──────────────────────────────────────────────────────
const menuData = [
  {
    category: "Fitur Mahasiswa",
    items: [
      { label: "Akun Mahasiswa", icon: User, href: "/akun-mahasiswa" },
      { label: "Persona REXTRA", icon: Fingerprint, href: "/persona-rextra" },
      { label: "Pendidikan", icon: GraduationCap, href: "/pendidikan" },
      {
        label: "Membership",
        icon: Crown,
        href: "#",
        children: [
          { label: "Fitur & Hak Akses", href: "/membership/fitur-hak-akses" },
          { label: "Status Membership", href: "/membership/status" },
          { label: "Riwayat Langganan", href: "/membership/riwayat-langganan" },
          { label: "Promo & Diskon", href: "/membership/promo-diskon" },
          { label: "Pengaturan", href: "/membership/pengaturan" },
        ],
      },
      {
        label: "Sistem Token",
        icon: Coins,
        href: "#",
        children: [
          { label: "Ikhtisar Token", href: "/sistem-token/ikhtisar" },
          { label: "Pengadaan Token", href: "/sistem-token/pengadaan" },
          { label: "Ledger Token", href: "/sistem-token/ledger" },
        ],
      },
      {
        label: "Kenali Diri",
        icon: Heart,
        href: "#",
        children: [
          { label: "Master Data", href: "/kenali-diri/master-data" },
          { label: "Hasil Tes", href: "/kenali-diri/hasil-tes" },
          { label: "Umpan Balik", href: "/kenali-diri/umpan-balik" },
        ],
      },
      {
        label: "Kamus Karier",
        icon: BookOpen,
        href: "#",
        children: [
          { label: "Master Data", href: "/kamus-karier/master-data" },
          { label: "Kecocokan Profesi", href: "/kamus-karier/kecocokan-profesi" },
          { label: "Statistik", href: "/kamus-karier/statistik" },
        ],
      },
    ],
  },
  {
    category: "Fitur Perusahaan",
    items: [
      { label: "Profil Perusahaan", icon: Building2, href: "/profil-perusahaan" },
      { label: "Lowongan Kerja", icon: FileText, href: "/lowongan-kerja" },
    ],
  },
  {
    category: "Performa Usaha",
    items: [
      { label: "Capaian Pengguna", icon: Trophy, href: "/capaian-pengguna" },
      { label: "Capaian Keuangan", icon: DollarSign, href: "/capaian-keuangan" },
      { label: "Visualisasi Performa", icon: BarChart3, href: "/visualisasi-performa" },
    ],
  },
];

// ─── Sidebar Content ────────────────────────────────────────────────
function SidebarContent({
  isOpen,
  onClose,
  isMobile = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const pathname = location.pathname;

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // Auto-expand active parent
  useEffect(() => {
    menuData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some(
            (child) => pathname === child.href || pathname.startsWith(child.href + "/")
          );
          if (isChildActive) {
            setExpandedMenus((prev) =>
              prev.includes(item.label) ? prev : [...prev, item.label]
            );
          }
        }
      });
    });
  }, [pathname]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={cn(
          "h-20 flex items-center shrink-0 border-b border-sidebar-border",
          isOpen && !isMobile ? "justify-between px-6" : isMobile ? "justify-between px-6" : "justify-center px-2"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap min-w-0">
          {isOpen || isMobile ? (
            <img src={logoRextra} alt="Rextra Logo" className="h-8 object-contain" />
          ) : (
            <img src={logoRextra} alt="Rextra Icon" className="h-8 w-8 object-contain" />
          )}
        </div>
        {(isOpen || isMobile) && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground ml-2 transition-colors"
          >
            {isMobile ? <X size={24} /> : <ChevronLeft size={24} />}
          </button>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {menuData.map((section, idx) => (
          <div key={idx} className="mb-6">
            {(isOpen || isMobile) && (
              <p className="px-3 mb-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                {section.category}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isMenuExpanded = expandedMenus.includes(item.label);
                const isSelfActive = pathname === item.href;
                const isChildActive = item.children?.some(
                  (c) => pathname === c.href || pathname.startsWith(c.href + "/")
                );
                const isParentActive = isSelfActive || isChildActive;
                const Icon = item.icon;

                return (
                  <div key={item.label}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={cn(
                          "flex items-center w-full p-3 rounded-2xl transition-all duration-200 group relative",
                          isOpen || isMobile ? "justify-between" : "justify-center flex-col gap-1",
                          isParentActive && (isOpen || isMobile)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("flex items-center gap-4", !isOpen && !isMobile && "flex-col gap-0")}>
                          <Icon
                            size={22}
                            className={cn(
                              isParentActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}
                            strokeWidth={1.5}
                          />
                          <span
                            className={cn(
                              "whitespace-nowrap transition-all duration-200 text-[15px]",
                              isOpen || isMobile ? "opacity-100" : "opacity-0 w-0 h-0 hidden"
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                        {(isOpen || isMobile) && (
                          <ChevronDown
                            size={18}
                            className={cn(
                              "transition-transform duration-200 text-muted-foreground",
                              isMenuExpanded ? "rotate-180" : ""
                            )}
                          />
                        )}
                      </button>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={cn(
                          "flex items-center w-full p-3 rounded-2xl transition-all duration-200 group relative",
                          isOpen || isMobile ? "justify-start" : "justify-center flex-col gap-1",
                          isSelfActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("flex items-center gap-4", !isOpen && !isMobile && "flex-col gap-0")}>
                          <Icon
                            size={22}
                            className={cn(
                              isSelfActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}
                            strokeWidth={1.5}
                          />
                          <span
                            className={cn(
                              "whitespace-nowrap transition-all duration-200 text-[15px]",
                              isOpen || isMobile ? "opacity-100" : "opacity-0 w-0 h-0 hidden"
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                      </NavLink>
                    )}

                    {/* Sub Menu with vertical line + dots */}
                    {hasChildren && (isOpen || isMobile) && (
                      <div
                        className={cn(
                          "grid transition-all duration-300 ease-in-out overflow-hidden",
                          isMenuExpanded
                            ? "grid-rows-[1fr] opacity-100 mt-1"
                            : "grid-rows-[0fr] opacity-0 mt-0"
                        )}
                      >
                        <div className="min-h-0 relative">
                          {/* Vertical line */}
                          <div className="absolute left-[23px] top-0 bottom-2 w-px bg-border z-0" />
                          {item.children?.map((subItem, subIdx) => {
                            const isSubActive =
                              pathname === subItem.href ||
                              (subItem.href !== "/" && pathname.startsWith(subItem.href + "/"));
                            return (
                              <NavLink
                                key={subIdx}
                                to={subItem.href}
                                className="relative flex items-center py-2.5 pl-14 text-sm hover:text-primary group/sub w-full"
                              >
                                {/* Dot indicator */}
                                <div
                                  className={cn(
                                    "absolute left-[19px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-all z-10",
                                    isSubActive
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/30 bg-background group-hover/sub:border-primary/50"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "transition-colors",
                                    isSubActive ? "font-medium text-primary" : "text-muted-foreground"
                                  )}
                                >
                                  {subItem.label}
                                </span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {(isOpen || isMobile) && (
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground/60 text-center">© 2025 REXTRA Admin</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Sidebar Component ─────────────────────────────────────────
interface AppSidebarProps {
  className?: string;
  onClose?: () => void;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ className, onClose, isCollapsed: controlledCollapsed, onCollapsedChange }: AppSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setIsCollapsed = onCollapsedChange || setInternalCollapsed;

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // If used as mobile sidebar (onClose provided), render directly
  if (onClose) {
    return (
      <aside
        className={cn(
          "h-screen bg-card shadow-sidebar flex flex-col w-[300px]",
          className
        )}
      >
        <SidebarContent isOpen={true} onClose={onClose} isMobile={true} />
      </aside>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-sidebar-border shadow-sidebar flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[300px]",
        className
      )}
    >
      <SidebarContent
        isOpen={!isCollapsed}
        onClose={() => setIsCollapsed(!isCollapsed)}
        isMobile={false}
      />

      {/* Click area to expand when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute inset-0 z-10 cursor-pointer bg-transparent"
          style={{ pointerEvents: "auto" }}
          aria-label="Expand sidebar"
        />
      )}
    </aside>
  );
}
