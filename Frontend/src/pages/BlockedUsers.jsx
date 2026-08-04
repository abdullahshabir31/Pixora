import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/Empty";
import { UsersAPI } from "@/services/users";

export default function BlockedPage() {
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(null);

  useEffect(() => {
    fetchBlocked();
  }, []);

  const fetchBlocked = async () => {
    setLoading(true);
    try {
      const res = await UsersAPI.blockedList();
      const ids = res.data.blocked_users.map((b) => b.blocked_id);
      const profiles = await Promise.all(
        ids.map((id) =>
          UsersAPI.getById(id)
            .then((r) => r.data)
            .catch(() => null),
        ),
      );
      setBlocked(profiles.filter(Boolean));
    } catch (error) {
      console.error("Failed to load blocked users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    setPending(userId);
    try {
      await UsersAPI.unblock(userId);
      setBlocked((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Failed to unblock user", error);
      alert(error?.response?.data?.detail || "Failed to unblock user.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/settings"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-3xl font-bold">Blocked users</h1>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="h-11 w-11 rounded-full skeleton" />
              <div className="h-3 w-24 rounded skeleton" />
            </div>
          ))}
        </div>
      ) : blocked.length === 0 ? (
        <EmptyState
          title="No one is blocked"
          description="When you block someone, they'll appear here."
          icon={<Shield className="h-6 w-6" />}
        />
      ) : (
        <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
          {blocked.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar username={u.username} src={u.profile_image} />
                <span className="text-sm font-semibold">@{u.username}</span>
              </div>
              <button
                onClick={() => handleUnblock(u.id)}
                disabled={pending === u.id}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-medium disabled:opacity-60"
              >
                {pending === u.id ? "…" : "Unblock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
