import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";
import { Avatar } from "@/components/Avatar";

const kinds = [
  { icon: Heart, text: "liked your post" },
  { icon: UserPlus, text: "started following you" },
  { icon: MessageCircle, text: "commented: 'Beautiful shot!'" },
  { icon: AtSign, text: "mentioned you in a comment" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Notifications</h1>
      <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => {
          const k = kinds[i % kinds.length];
          const Icon = k.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-accent/40">
              <div className="relative">
                <Avatar username={`user${i}`} />
                <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant">
                  <Icon className="h-3 w-3" />
                </span>
              </div>
              <div className="flex-1 text-sm">
                <span className="font-semibold">@user_{i + 1}</span>{" "}
                <span className="text-muted-foreground">{k.text}</span>
                <div className="text-[11px] text-muted-foreground">{i + 1}h ago</div>
              </div>
              <button className="hidden sm:inline-flex rounded-full border border-border px-3 py-1.5 text-xs">View</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
