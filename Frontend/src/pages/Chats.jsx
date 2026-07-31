import { Link } from "react-router-dom";
import { Search, Edit3 } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function ChatsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Messages</h1>
        <button className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant">
          <Edit3 className="h-4 w-4" /> New
        </button>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search messages…" className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none ring-ring focus:ring-2" />
      </div>

      <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <Link
            key={i}
            to={`/chats/${i + 1}`}
            className="flex items-center gap-4 p-4 hover:bg-accent/40"
          >
            <Avatar username={`friend${i}`} storyRing={i < 3} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">@friend_{i + 1}</span>
                <span className="text-[11px] text-muted-foreground">{i + 1}m</span>
              </div>
              <p className="truncate text-sm text-muted-foreground">Hey! Loved your latest post 💫</p>
            </div>
            {i % 3 === 0 && <span className="h-2 w-2 rounded-full bg-gradient-brand" />}
          </Link>
        ))}
      </div>
    </div>
  );
}
