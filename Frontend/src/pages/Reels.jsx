import { Heart, MessageCircle, Music2, Volume2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function ReelsPage() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl font-bold">Reels</h1>
      <div className="snap-y snap-mandatory h-[calc(100vh-12rem)] overflow-y-scroll rounded-3xl border border-border bg-surface scrollbar-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="snap-start relative flex h-[calc(100vh-12rem)] w-full items-end overflow-hidden">
            <div className="absolute inset-0 bg-gradient-brand-soft" />
            <div className="absolute inset-0 skeleton opacity-20" />
            <div className="relative z-10 flex w-full items-end justify-between p-5">
              <div className="max-w-[75%]">
                <div className="flex items-center gap-2">
                  <Avatar username={`creator${i}`} size="sm" storyRing />
                  <span className="text-sm font-semibold text-primary-foreground drop-shadow">@creator_{i + 1}</span>
                  <span className="rounded-full border border-primary-foreground/40 px-2 py-0.5 text-[10px] text-primary-foreground">Follow</span>
                </div>
                <p className="mt-2 text-sm text-primary-foreground drop-shadow">Golden hour vibes ✨ #pixora</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-primary-foreground drop-shadow">
                  <Music2 className="h-3 w-3" /> original sound
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <button className="rounded-full bg-black/30 p-3 text-primary-foreground backdrop-blur"><Heart className="h-5 w-5" /></button>
                <button className="rounded-full bg-black/30 p-3 text-primary-foreground backdrop-blur"><MessageCircle className="h-5 w-5" /></button>
                <button className="rounded-full bg-black/30 p-3 text-primary-foreground backdrop-blur"><Volume2 className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
