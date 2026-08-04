import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { PostsAPI } from "@/services/posts";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await PostsAPI.get(id);
      setPost(res.data);
      setCaption(res.data.caption || "");
    } catch (error) {
      console.error("Edit Post Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await PostsAPI.update(id, { caption, image_url: post.image_url });
      navigate(`/post/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post permanently?")) return;

    try {
      await PostsAPI.remove(id);
      navigate("/feed");
    } catch (error) {
      console.error(error);
      alert("Failed to delete post.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 skeleton rounded" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl skeleton" />
          <div className="h-64 rounded-3xl skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/post/${id}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-3xl font-bold">Edit post</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-brand-soft">
          {post?.image_url && (
            <img
              src={post.image_url}
              alt="Post"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <form
          className="rounded-3xl border border-border bg-surface p-6 space-y-4"
          onSubmit={handleSave}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Caption
            </span>
            <textarea
              rows={5}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2 resize-none"
            />
          </label>

          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full border border-destructive/30 px-5 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              Delete post
            </button>

            <div className="flex gap-2">
              <Link
                to={`/post/${id}`}
                className="rounded-full border border-border px-5 py-2 text-sm font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-elegant disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
