import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { PostSkeleton, EmptyState } from "@/components/Empty";
import { PostsAPI } from "@/services/posts";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await PostsAPI.feed();

      const formattedPosts = res.data.map((post) => ({
        id: post.id,
        username: post.owner.username,
        imageUrl: post.image_url,
        caption: post.caption,
        createdAt: post.created_at,
        likes: post.likes_count,
        comments: post.comments_count,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Feed Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stories rail */}
      <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
        <div className="flex gap-4 overflow-x-auto scrollbar-none">
          <Link
            to="/create-story"
            className="flex flex-col items-center gap-1.5 min-w-16"
          >
            <div className="relative h-16 w-16 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-[11px] text-muted-foreground">
              Your story
            </span>
          </Link>

          {Array.from({ length: 8 }).map((_, i) => (
            <Link
              key={i}
              to={`/stories/${i + 1}`}
              className="flex flex-col items-center gap-1.5 min-w-16"
            >
              <Avatar username={`u${i}`} size="lg" storyRing />
              <span className="text-[11px] text-muted-foreground truncate w-16 text-center">
                user_{i + 1}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Follow users to see their latest posts."
            action={{
              label: "Explore",
              to: "/explore",
            }}
          />
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </motion.div>
    </div>
  );
}
