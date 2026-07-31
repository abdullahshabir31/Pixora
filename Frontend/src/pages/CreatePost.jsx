import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ImageIcon } from "lucide-react";
import { PostsAPI } from "@/services/posts";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);

      await PostsAPI.create(formData);

      alert("Post uploaded successfully!");

      navigate("/feed");
    } catch (error) {
      console.error(error);
      alert("Failed to upload post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Create a post</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface hover:border-brand-2 transition-colors overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand-soft text-foreground">
                <ImageIcon className="h-6 w-6" />
              </div>

              <div className="mt-4 font-display text-lg font-semibold">
                Drop photos here
              </div>

              <div className="text-xs text-muted-foreground">
                or click to browse from your device
              </div>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-primary-foreground shadow-elegant">
                <Upload className="h-3.5 w-3.5" />
                Select photo
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <form
          className="rounded-3xl border border-border bg-surface p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Caption
            </span>

            <textarea
              rows={5}
              placeholder="Write a caption…"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2 resize-none"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-full border border-border px-5 py-2 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-elegant disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
