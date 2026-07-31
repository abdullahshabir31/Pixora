import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/Empty";

export default function BlockedPage() {
  const blocked = [];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/settings" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-3xl font-bold">Blocked users</h1>
      </div>

      {blocked.length === 0 ? (
        <EmptyState title="No one is blocked" description="When you block someone, they'll appear here." icon={<Shield className="h-6 w-6" />} />
      ) : (
        <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
          {blocked.map((u) => (
            <div key={u} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar username={u} />
                <span className="text-sm font-semibold">@{u}</span>
              </div>
              <button className="rounded-full border border-border px-4 py-1.5 text-xs font-medium">Unblock</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
