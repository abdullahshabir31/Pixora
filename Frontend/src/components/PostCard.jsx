import { motion } from "motion/react";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

export function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-border bg-surface shadow-soft overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={`/profile/${post.username}`} className="flex items-center gap-3">
          <Avatar username={post.username} size="sm" storyRing />
          <div>
            <div className="text-sm font-semibold">@{post.username}</div>
            <div className="text-[11px] text-muted-foreground">{post.createdAt ?? "just now"}</div>
          </div>
        </Link>
        <button className="rounded-full p-2 text-muted-foreground hover:bg-accent">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <Link to={`/post/${post.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-gradient-brand-soft">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.caption ?? "Post"} className="h-full w-full object-cover" />
          ) : null}
        </div>
      </Link>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              liked ? "text-brand-2" : "hover:bg-accent"
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </button>
          <Link
            to={`/post/${post.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => setSaved((v) => !v)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${saved ? "text-brand-2" : "hover:bg-accent"}`}
        >
          <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="px-4 pb-4 text-sm">
        <div className="font-semibold">{post.likes + (liked ? 1 : 0)} likes</div>
        {post.caption && (
          <p className="mt-1 text-foreground/90">
            <span className="font-semibold mr-2">@{post.username}</span>
            {post.caption}
          </p>
        )}
        {post.comments > 0 && (
          <Link to={`/post/${post.id}`} className="mt-1 block text-xs text-muted-foreground">
            View all {post.comments} comments
          </Link>
        )}
      </div>
    </motion.article>
  );
}
