import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ImageIcon } from "lucide-react";
import { StoriesAPI } from "@/services/stories";

export default function CreateStoryPage() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select a photo first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      await StoriesAPI.create(formData);

      alert("Story shared successfully!");

      navigate("/feed");
    } catch (error) {
      console.error(error);
      alert("Failed to share story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">New story</h1>

      <label className="mx-auto flex aspect-[9/16] w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 border-dashed border-border bg-surface p-6 text-center hover:border-brand-2 transition-colors">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-elegant">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">
                Add to your story
              </div>
              <div className="text-xs text-muted-foreground">
                Share a photo, video or moment
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-primary-foreground">
              <ImageIcon className="h-3.5 w-3.5" /> Select photo
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

      <div className="mx-auto flex w-full max-w-sm justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-border px-5 py-2 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-elegant disabled:opacity-60"
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </div>
    </div>
  );
}
