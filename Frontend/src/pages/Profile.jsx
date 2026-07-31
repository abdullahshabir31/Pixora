import { Link, useParams } from "react-router-dom";
import { Settings, Grid3x3, Film, Bookmark, UserCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { EmptyState, PostSkeleton } from "@/components/Empty";
import { useEffect, useState } from "react";
import { UsersAPI } from "@/services/users";
import { PostsAPI } from "@/services/posts";
import { AuthAPI } from "@/services/auth";

const tabs = [
  { key: "posts", label: "Posts", icon: Grid3x3 },
  { key: "reels", label: "Reels", icon: Film },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "tagged", label: "Tagged", icon: UserCheck },
];

export default function ProfilePage() {
  const { username } = useParams();
  const [tab, setTab] = useState("posts");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    setLoading(true);
    setPostsLoading(true);

    try {
      const [profileRes, meRes] = await Promise.all([
        UsersAPI.profile(username),
        AuthAPI.me(),
      ]);

      setProfile(profileRes.data);
      setIsOwnProfile(profileRes.data.username === meRes.data.username);

      const postsRes = await PostsAPI.byUser(profileRes.data.id);
      setPosts(postsRes.data);
    } catch (error) {
      console.error("Profile Error:", error);
      setProfile(null);
    } finally {
      setLoading(false);
      setPostsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <PostSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="User not found"
        description="This profile doesn't exist or you don't have access to it."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar
            username={profile.username}
            src={profile.profile_image}
            size="xl"
            storyRing
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold">
                @{profile.username}
              </h1>
              {isOwnProfile && (
                <>
                  <Link
                    to="/edit-profile"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    Edit profile
                  </Link>
                  <Link
                    to="/settings"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
            <div className="mt-3 text-sm">
              {profile.full_name && (
                <div className="font-semibold">{profile.full_name}</div>
              )}
              {profile.bio && (
                <div className="text-muted-foreground">{profile.bio}</div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:underline"
                >
                  {profile.website}
                </a>
              )}
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <Stat label="posts" value={profile.posts_count} />
              <Link to={`/profile/${username}/followers`}>
                <Stat label="followers" value={profile.followers_count} />
              </Link>
              <Link to={`/profile/${username}/following`}>
                <Stat label="following" value={profile.following_count} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface overflow-hidden">
        <div className="flex border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === t.key
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "posts" ? (
          postsLoading ? (
            <div className="grid grid-cols-3 gap-1 p-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square skeleton rounded-lg" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No posts yet"
                description="Posts shared by this account will show up here."
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 p-1">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="aspect-square overflow-hidden rounded-lg bg-gradient-brand-soft"
                >
                  <img
                    src={post.image_url}
                    alt={post.caption || "post"}
                    className="h-full w-full object-cover"
                  />
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="p-6">
            <EmptyState
              title="Coming soon"
              description="This tab isn't wired up yet."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
