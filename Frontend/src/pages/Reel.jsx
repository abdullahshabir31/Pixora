import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ReelsAPI } from "@/services/reels";

export default function ReelPage() {
  const { id } = useParams();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchReel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReel = async () => {
    setLoading(true);
    try {
      // No single-reel endpoint on the backend — fetch the list and find it.
      const res = await ReelsAPI.feed();
      const found = res.data.find((r) => r.id === Number(id));
      setReel(found || null);
    } catch (error) {
      console.error("Reel Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md">
        <div className="aspect-[9/16] rounded-3xl skeleton" />
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Reel not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-black">
        <video
          src={reel.video_url}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <Link
            to={`/profile/${reel.owner.username}`}
            className="flex items-center gap-2"
          >
            <Avatar
              username={reel.owner.username}
              src={reel.owner.profile_image}
              size="sm"
              storyRing
            />
            <span className="text-sm font-semibold text-primary-foreground drop-shadow">
              @{reel.owner.username}
            </span>
          </Link>
          {reel.caption && (
            <p className="mt-2 text-sm text-primary-foreground drop-shadow">
              {reel.caption}
            </p>
          )}
        </div>

        <div className="absolute right-4 bottom-8 flex flex-col gap-3">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`rounded-full bg-black/40 p-3 backdrop-blur ${
              liked ? "text-brand-2" : "text-primary-foreground"
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </button>
          <button className="rounded-full bg-black/40 p-3 text-primary-foreground backdrop-blur">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button className="rounded-full bg-black/40 p-3 text-primary-foreground backdrop-blur">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
