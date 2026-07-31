import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  Film,
  Search,
  MessageCircle,
  Bell,
  Bookmark,
  PlusSquare,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "./Avatar";

const nav = [
  { to: "/feed", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/reels", label: "Reels", icon: Film },
  { to: "/search", label: "Search", icon: Search },
  { to: "/chats", label: "Messages", icon: MessageCircle },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/create-post", label: "Create", icon: PlusSquare },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-72 flex-col overflow-y-auto scrollbar-none border-r border-border bg-surface/60 glass px-5 py-6">
      <div className="mb-8 px-2">
        <Logo size="md" />
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== "/feed" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-brand text-primary-foreground shadow-elegant"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1 border-t border-border pt-4 pb-4">
        <Link
          to="/profile/me"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-accent"
        >
          <Avatar username="me" size="sm" />
          <span>Profile</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-accent"
        >
          <Settings className="h-5 w-5" /> Settings
        </Link>
        <div className="flex items-center justify-between px-3 pt-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function TopBar() {
  return (
    <header className="lg:hidden sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/notifications"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
          >
            <Bell className="h-4 w-4" />
          </Link>
          <Link
            to="/chats"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

const bottomItems = [
  { to: "/feed", icon: Home },
  { to: "/explore", icon: Compass },
  { to: "/create-post", icon: PlusSquare },
  { to: "/reels", icon: Film },
  { to: "/profile/me", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {bottomItems.map((it) => {
          const active = pathname === it.to || (it.to !== "/feed" && pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                active ? "bg-gradient-brand text-primary-foreground shadow-elegant" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
