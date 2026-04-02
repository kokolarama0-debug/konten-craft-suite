import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Mic2,
  ImageIcon,
  Video,
  Menu,
} from "lucide-react";

const bottomNavItems = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: FileText, label: "Text", path: "/text" },
  { icon: Mic2, label: "Voice", path: "/voice" },
  { icon: ImageIcon, label: "Image", path: "/image" },
  { icon: Video, label: "Video", path: "/video" },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-sidebar/95 backdrop-blur-xl md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  isActive && "bg-primary/15 scale-110"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
