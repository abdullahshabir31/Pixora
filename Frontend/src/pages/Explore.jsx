import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ExploreAPI } from "@/services/notifications";
import { EmptyState } from "@/components/Empty";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ExploreAPI.list({ skip: 0, limit: 30 })
      .then((res) => setPosts(res.data))
      .catch((error) => console.error("Failed to load explore posts", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Explore</h1>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" /> Search people
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-2xl bg-gradient-brand-soft"
            >
              <div className="h-full w-full skeleton opacity-40" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="Nothing to explore yet"
          description="Posts from the community will show up here."
        />
      ) : (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {posts.map((p, i) => {
            const tall = i % 7 === 3;
            return (
              <Link
                key={p.id}
                to={`/post/${p.id}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-brand-soft ${tall ? "row-span-2 aspect-[1/2]" : "aspect-square"}`}
              >
                <img
                  src={p.image_url}
                  alt={p.caption || "Post"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="text-xs font-medium text-primary-foreground drop-shadow">
                    @{p.owner.username}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
