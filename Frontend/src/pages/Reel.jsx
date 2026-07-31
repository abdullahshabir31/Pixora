import { useParams } from "react-router-dom";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function ReelPage() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-md">
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-gradient-brand-soft">
        <div className="absolute inset-0 skeleton opacity-20" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center gap-2">
            <Avatar username="creator" size="sm" storyRing />
            <span className="text-sm font-semibold text-primary-foreground drop-shadow">Reel #{id}</span>
          </div>
        </div>
        <div className="absolute right-4 bottom-8 flex flex-col gap-3">
          <button className="rounded-full bg-black/40 p-3 text-primary-foreground backdrop-blur"><Heart className="h-5 w-5" /></button>
          <button className="rounded-full bg-black/40 p-3 text-primary-foreground backdrop-blur"><MessageCircle className="h-5 w-5" /></button>
          <button className="rounded-full bg-black/40 p-3 text-primary-foreground backdrop-blur"><Share2 className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
}
