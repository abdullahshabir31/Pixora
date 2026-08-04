import { Link, useParams } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
  Smile,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { useState, useEffect } from "react";
import {
  PostsAPI,
  LikesAPI,
  CommentsAPI,
  SavedPostsAPI,
} from "@/services/posts";
import { UsersAPI } from "@/services/users";
import { AuthAPI } from "@/services/auth";

export default function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const meRes = await AuthAPI.me();
      setCurrentUser(meRes.data);

      const [postRes, likesRes, commentsRes, savedRes] = await Promise.all([
        PostsAPI.get(id),
        LikesAPI.list(id),
        CommentsAPI.list(id),
        SavedPostsAPI.list(),
      ]);

      setPost(postRes.data);
      setLikesCount(likesRes.data.total_likes);
      setLiked(likesRes.data.likes.some((l) => l.user_id === meRes.data.id));
      setSaved(savedRes.data.some((p) => p.id === Number(id)));

      // Comments only carry user_id — resolve usernames for display
      const userIds = [...new Set(commentsRes.data.map((c) => c.user_id))];
      const profiles = await Promise.all(
        userIds.map((uid) =>
          uid === meRes.data.id
            ? Promise.resolve({ id: uid, username: meRes.data.username })
            : UsersAPI.getById(uid)
                .then((r) => r.data)
                .catch(() => null),
        ),
      );
      const userMap = Object.fromEntries(
        profiles.filter(Boolean).map((u) => [u.id, u]),
      );

      setComments(
        commentsRes.data.map((c) => ({
          ...c,
          username: userMap[c.user_id]?.username || "user",
        })),
      );
    } catch (error) {
      console.error("Post Detail Error:", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    const next = !liked;
    setLiked(next);
    setLikesCount((c) => c + (next ? 1 : -1));

    try {
      if (next) await LikesAPI.like(id);
      else await LikesAPI.unlike(id);
    } catch (error) {
      // revert on failure
      setLiked(!next);
      setLikesCount((c) => c + (next ? -1 : 1));
      console.error("Like Error:", error);
    }
  };

  const handleSaveToggle = async () => {
    const next = !saved;
    setSaved(next);

    try {
      if (next) await SavedPostsAPI.save(id);
      else await SavedPostsAPI.unsave(id);
    } catch (error) {
      setSaved(!next);
      console.error("Save Error:", error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await CommentsAPI.create(id, { content: commentText });

      setComments((prev) => [
        ...prev,
        { ...res.data, username: currentUser?.username || "you" },
      ]);
      setCommentText("");
    } catch (error) {
      console.error("Comment Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 rounded-3xl border border-border bg-surface overflow-hidden shadow-soft">
        <div className="aspect-square bg-gradient-brand-soft skeleton opacity-40" />
        <div className="p-6 space-y-3">
          <div className="h-4 w-1/3 skeleton rounded" />
          <div className="h-4 w-2/3 skeleton rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Post not found.
      </div>
    );
  }

  const isOwner = currentUser?.id === post.owner.id;

  return (
    <div className="grid gap-6 lg:grid-cols-2 rounded-3xl border border-border bg-surface overflow-hidden shadow-soft">
      <div className="aspect-square overflow-hidden bg-gradient-brand-soft">
        <img
          src={post.image_url}
          alt={post.caption || "post"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <Link
            to={`/profile/${post.owner.username}`}
            className="flex items-center gap-3"
          >
            <Avatar username={post.owner.username} size="sm" storyRing />
            <div className="text-sm font-semibold">@{post.owner.username}</div>
          </Link>

          {isOwner && (
            <Link
              to={`/edit-post/${id}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Edit
            </Link>
          )}
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {post.caption && (
            <p className="text-sm">
              <span className="font-semibold mr-2">@{post.owner.username}</span>
              {post.caption}
            </p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar username={comment.username} size="xs" />

              <div className="text-sm">
                <span className="font-semibold mr-2">@{comment.username}</span>
                <span>{comment.content}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handleLikeToggle}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                liked ? "text-brand-2" : "hover:bg-accent"
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </button>

            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent">
              <MessageCircle className="h-5 w-5" />
            </button>

            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent">
              <Share2 className="h-5 w-5" />
            </button>

            <div className="ml-auto">
              <button
                onClick={handleSaveToggle}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                  saved ? "text-brand-2" : "hover:bg-accent"
                }`}
              >
                <Bookmark
                  className={`h-5 w-5 ${saved ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="font-semibold text-sm">{likesCount} likes</div>

          {/* Add Comment */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
            <Smile className="h-4 w-4 text-muted-foreground" />

            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent py-2 text-sm outline-none"
            />

            <button
              onClick={handleComment}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
