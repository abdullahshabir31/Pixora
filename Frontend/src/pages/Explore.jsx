import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Explore</h1>
        <Link to="/search" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" /> Search people
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {Array.from({ length: 18 }).map((_, i) => {
          const tall = i % 7 === 3;
          return (
            <Link
              key={i}
              to={`/post/${i + 1}`}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-brand-soft ${tall ? "row-span-2 aspect-[1/2]" : "aspect-square"}`}
            >
              <div className="absolute inset-0 skeleton opacity-40" />
              <div className="absolute inset-0 flex items-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="text-xs font-medium text-primary-foreground drop-shadow">@creator_{i + 1}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
