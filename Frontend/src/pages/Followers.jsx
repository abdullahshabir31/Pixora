import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { UserRow } from "@/components/UserRow";

export default function FollowersPage() {
  const { username } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${username}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Followers</h1>
      </div>
      <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <UserRow key={i} name={`follower_${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
