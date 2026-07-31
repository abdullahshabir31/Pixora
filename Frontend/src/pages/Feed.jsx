import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { PostSkeleton, EmptyState } from "@/components/Empty";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      {/* Stories rail */}
      <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
        <div className="flex gap-4 overflow-x-auto scrollbar-none">
          <Link to="/create-story" className="flex flex-col items-center gap-1.5 min-w-16">
            <div className="relative h-16 w-16 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-[11px] text-muted-foreground">Your story</span>
          </Link>
          {Array.from({ length: 8 }).map((_, i) => (
            <Link key={i} to={`/stories/${i + 1}`} className="flex flex-col items-center gap-1.5 min-w-16">
              <Avatar username={`u${i}`} size="lg" storyRing />
              <span className="text-[11px] text-muted-foreground truncate w-16 text-center">user_{i + 1}</span>
            </Link>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <EmptyState
          title="Your feed is loading"
          description="Follow creators or connect your backend — posts you follow will appear here."
          action={{ label: "Discover creators", to: "/explore" }}
        />
        <PostSkeleton />
        <PostSkeleton />
      </motion.div>
    </div>
  );
}
