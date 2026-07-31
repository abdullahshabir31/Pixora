import { Link, useParams } from "react-router-dom";
import { Settings, Grid3x3, Film, Bookmark, UserCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { useState } from "react";

const tabs = [
  { key: "posts", label: "Posts", icon: Grid3x3 },
  { key: "reels", label: "Reels", icon: Film },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "tagged", label: "Tagged", icon: UserCheck },
];

export default function ProfilePage() {
  const { username } = useParams();
  const [tab, setTab] = useState("posts");
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar username={username} size="xl" storyRing />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold">@{username}</h1>
              <Link to="/edit-profile" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                Edit profile
              </Link>
              <Link to="/settings" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent">
                <Settings className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-3 text-sm">
              <div className="font-semibold">Full Name</div>
              <div className="text-muted-foreground">✨ Photographer • traveler • dreamer</div>
              <div className="text-muted-foreground">pixora.app/{username}</div>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <Stat label="posts" value={0} />
              <Link to={`/profile/${username}/followers`}>
                <Stat label="followers" value={0} />
              </Link>
              <Link to={`/profile/${username}/following`}>
                <Stat label="following" value={0} />
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
                tab === t.key ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 p-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <Link key={i} to={`/post/${i + 1}`} className="aspect-square overflow-hidden rounded-lg bg-gradient-brand-soft">
              <div className="h-full w-full skeleton opacity-40" />
            </Link>
          ))}
        </div>
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
