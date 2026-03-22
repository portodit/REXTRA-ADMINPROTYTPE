import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopNavbarProps {
  className?: string;
  onMenuClick?: () => void;
}

export function TopNavbar({ className, onMenuClick }: TopNavbarProps) {
  return (
    <header
      className={`h-20 bg-card border-b border-sidebar-border flex items-center justify-between px-4 md:px-8 w-full ${className}`}
    >
      {/* Left: Menu button (mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          <Menu size={22} />
        </button>
        {/* Breadcrumbs placeholder */}
        <div />
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Bell size={20} />
          </div>
          <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-primary border-2 border-card rounded-full" />
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-border mx-1 hidden md:block" />

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">AD</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-foreground">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@rextra.id</span>
          </div>
        </div>
      </div>
    </header>
  );
}
