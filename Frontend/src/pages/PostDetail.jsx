import { Link, useParams } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Share2, Send, Smile } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { useState } from "react";

export default function PostDetail() {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  return (
    <div className="grid gap-6 lg:grid-cols-2 rounded-3xl border border-border bg-surface overflow-hidden shadow-soft">
      <div className="aspect-square bg-gradient-brand-soft skeleton opacity-40" />
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <Link to="/profile/creator" className="flex items-center gap-3">
            <Avatar username="creator" size="sm" storyRing />
            <div className="text-sm font-semibold">@creator</div>
          </Link>
          <Link to={`/edit-post/${id}`} className="text-xs text-muted-foreground hover:text-foreground">Edit</Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-sm">
            <span className="font-semibold mr-2">@creator</span>
            Golden hour will always be my favorite palette 🌅 #pixora
          </p>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Avatar username={`u${i}`} size="xs" />
              <div className="text-sm">
                <span className="font-semibold mr-2">@user_{i + 1}</span>
                <span>Absolutely stunning shot!</span>
                <div className="text-[11px] text-muted-foreground">{i + 1}h · Reply</div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-1">
            <button onClick={() => setLiked((v) => !v)} className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${liked ? "text-brand-2" : "hover:bg-accent"}`}>
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"><MessageCircle className="h-5 w-5" /></button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"><Share2 className="h-5 w-5" /></button>
            <div className="ml-auto">
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"><Bookmark className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="font-semibold text-sm">Post #{id} · {liked ? 1 : 0} likes</div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
            <Smile className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Add a comment…" className="flex-1 bg-transparent py-2 text-sm outline-none" />
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
