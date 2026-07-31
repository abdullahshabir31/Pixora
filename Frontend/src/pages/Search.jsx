import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/Empty";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const recents = ["design", "photography", "travel", "coffee"];
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Search</h1>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users, tags…"
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-11 text-sm outline-none ring-ring focus:ring-2"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!q && (
        <div className="rounded-3xl border border-border bg-surface p-5">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Recent</div>
          <div className="flex flex-wrap gap-2">
            {recents.map((r) => (
              <button key={r} onClick={() => setQ(r)} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent">
                #{r}
              </button>
            ))}
          </div>
        </div>
      )}

      {q ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Link
              key={i}
              to={`/profile/${q}_${i + 1}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <Avatar username={`${q}${i}`} />
                <div>
                  <div className="text-sm font-semibold">@{q}_{i + 1}</div>
                  <div className="text-xs text-muted-foreground">Suggested for you</div>
                </div>
              </div>
              <span className="rounded-full bg-gradient-brand px-3 py-1 text-xs font-medium text-primary-foreground">Follow</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="Start typing to search" description="Find creators, friends, or trending tags." />
      )}
    </div>
  );
}
