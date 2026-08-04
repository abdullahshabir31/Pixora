import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { UserRow } from "@/components/UserRow";
import { UsersAPI } from "@/services/users";
import { AuthAPI } from "@/services/auth";

export default function FollowingPage() {
  const { username } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const [myFollowing, setMyFollowing] = useState(new Set());
  const [pending, setPending] = useState(null);

  useEffect(() => {
    fetchFollowing();
  }, [username]);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const meRes = await AuthAPI.me();
      setMyId(meRes.data.id);

      const profileRes = await UsersAPI.profile(username);
      const targetId = profileRes.data.id;

      const [followingRes, myFollowingRes] = await Promise.all([
        UsersAPI.following(targetId),
        UsersAPI.following(meRes.data.id),
      ]);

      setMyFollowing(
        new Set(myFollowingRes.data.following.map((f) => f.following_id)),
      );

      const otherIds = followingRes.data.following.map((f) => f.following_id);

      const profiles = await Promise.all(
        otherIds.map((id) =>
          UsersAPI.getById(id)
            .then((r) => r.data)
            .catch(() => null),
        ),
      );

      setUsers(profiles.filter(Boolean));
    } catch (error) {
      console.error("Following Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (userId) => {
    setPending(userId);
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
      alert(error?.response?.data?.detail || "Action failed.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/profile/${username}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Following</h1>
      </div>

      <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            Not following anyone yet.
          </div>
        ) : (
          users.map((u) => (
            <UserRow
              key={u.id}
              userId={u.id}
              username={u.username}
              fullName={u.full_name}
              avatarSrc={u.profile_image}
              isFollowing={myFollowing.has(u.id)}
              isSelf={u.id === myId}
              loading={pending === u.id}
              onToggleFollow={handleToggleFollow}
            />
          ))
        )}
      </div>
    </div>
  );
}
