import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { SavedPostsAPI } from "@/services/posts";
import { EmptyState } from "@/components/Empty";

export default function SavedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SavedPostsAPI.list()
      .then((res) => setPosts(res.data))
      .catch((error) => console.error("Failed to load saved posts", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bookmark className="h-6 w-6" />
        <h1 className="font-display text-3xl font-bold">Saved</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
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
          title="No saved posts"
          description="Posts you save will show up here."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/post/${p.id}`}
              className="aspect-square overflow-hidden rounded-2xl bg-gradient-brand-soft"
            >
              <img
                src={p.image_url}
                alt={p.caption || "Saved post"}
                className="h-full w-full object-cover"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
