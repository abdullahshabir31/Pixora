import { useEffect, useState } from "react";
import { Heart, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Link } from "react-router-dom";
import { ReelsAPI } from "@/services/reels";
import { UsersAPI } from "@/services/users";
import { AuthAPI } from "@/services/auth";

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const [myFollowing, setMyFollowing] = useState(new Set());
  const [followLoading, setFollowLoading] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const meRes = await AuthAPI.me();
      setMyId(meRes.data.id);

      const [reelsRes, followingRes] = await Promise.all([
        ReelsAPI.feed(),
        UsersAPI.following(meRes.data.id),
      ]);

      setReels(reelsRes.data);
      setMyFollowing(
        new Set(followingRes.data.following.map((f) => f.following_id)),
      );
    } catch (error) {
      console.error("Reels Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId) => {
    setFollowLoading(userId);
    try {
      if (myFollowing.has(userId)) {
        await UsersAPI.unfollow(userId);
        setMyFollowing((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      } else {
        await UsersAPI.follow(userId);
        setMyFollowing((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFollowLoading(null);
    }
  };

  const toggleLike = (reelId) => {
    // No backend support for reel likes yet — visual only.
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(reelId) ? next.delete(reelId) : next.add(reelId);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl font-bold">Reels</h1>

      <div className="snap-y snap-mandatory h-[calc(100vh-12rem)] overflow-y-scroll rounded-3xl border border-border bg-surface scrollbar-none">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : reels.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No reels yet.
          </div>
        ) : (
          reels.map((reel) => (
            <div
              key={reel.id}
              className="snap-start relative flex h-[calc(100vh-12rem)] w-full items-end overflow-hidden bg-black"
            >
              <video
                src={reel.video_url}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted={muted}
                playsInline
              />

              <div className="relative z-10 flex w-full items-end justify-between p-5">
                <div className="max-w-[75%]">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${reel.owner.username}`}>
                      <Avatar
                        username={reel.owner.username}
                        src={reel.owner.profile_image}
                        size="sm"
                        storyRing
                      />
                    </Link>
                    <Link
                      to={`/profile/${reel.owner.username}`}
                      className="text-sm font-semibold text-primary-foreground drop-shadow"
                    >
                      @{reel.owner.username}
                    </Link>
                    {reel.owner.id !== myId && (
                      <button
                        onClick={() => toggleFollow(reel.owner.id)}
                        disabled={followLoading === reel.owner.id}
                        className="rounded-full border border-primary-foreground/40 px-2 py-0.5 text-[10px] text-primary-foreground disabled:opacity-60"
                      >
                        {myFollowing.has(reel.owner.id)
                          ? "Following"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                  {reel.caption && (
                    <p className="mt-2 text-sm text-primary-foreground drop-shadow">
                      {reel.caption}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => toggleLike(reel.id)}
                    className={`rounded-full bg-black/30 p-3 backdrop-blur ${
                      likedIds.has(reel.id)
                        ? "text-brand-2"
                        : "text-primary-foreground"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${likedIds.has(reel.id) ? "fill-current" : ""}`}
                    />
                  </button>
                  <button className="rounded-full bg-black/30 p-3 text-primary-foreground backdrop-blur">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setMuted((m) => !m)}
                    className="rounded-full bg-black/30 p-3 text-primary-foreground backdrop-blur"
                  >
                    {muted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
