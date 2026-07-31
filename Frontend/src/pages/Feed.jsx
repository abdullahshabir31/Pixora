import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { PostSkeleton, EmptyState } from "@/components/Empty";
import { PostsAPI } from "@/services/posts";
import { StoriesAPI } from "@/services/stories";
import { UsersAPI } from "@/services/users";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storyUsers, setStoryUsers] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
    fetchStories();
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

  const fetchStories = async () => {
    try {
      const res = await StoriesAPI.feed();

      // Group stories by owner so each user shows only once in the rail
      const ownerIds = [...new Set(res.data.map((s) => s.owner_id))];

      const owners = await Promise.all(
        ownerIds.map((id) =>
          UsersAPI.getById(id)
            .then((r) => ({ id, username: r.data.username }))
            .catch(() => null),
        ),
      );

      setStoryUsers(owners.filter(Boolean));
    } catch (error) {
      console.error("Stories Error:", error);
    } finally {
      setStoriesLoading(false);
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

          {!storiesLoading &&
            storyUsers.map((user) => (
              <Link
                key={user.id}
                to={`/stories/${user.id}`}
                className="flex flex-col items-center gap-1.5 min-w-16"
              >
                <Avatar username={user.username} size="lg" storyRing />
                <span className="text-[11px] text-muted-foreground truncate w-16 text-center">
                  {user.username}
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
