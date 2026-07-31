import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bookmark className="h-6 w-6" />
        <h1 className="font-display text-3xl font-bold">Saved</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <Link
            key={i}
            to={`/post/${i + 1}`}
            className="aspect-square overflow-hidden rounded-2xl bg-gradient-brand-soft"
          >
            <div className="h-full w-full skeleton opacity-40" />
          </Link>
        ))}
      </div>
    </div>
  );
}
