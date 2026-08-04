import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UserRow } from "@/components/UserRow";
import { EmptyState } from "@/components/Empty";
import { UsersAPI } from "@/services/users";
import { AuthAPI } from "@/services/auth";

const RECENTS_KEY = "pixora-recent-searches";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState(null);
  const [myFollowing, setMyFollowing] = useState(new Set());
  const [pending, setPending] = useState(null);
  const [recents, setRecents] = useState(() =>
    JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"),
  );

  useEffect(() => {
    AuthAPI.me()
      .then((meRes) => {
        setMyId(meRes.data.id);
        return UsersAPI.following(meRes.data.id);
      })
      .then((res) => {
        setMyFollowing(new Set(res.data.following.map((f) => f.following_id)));
      })
      .catch((error) => console.error("Search Init Error:", error));
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      UsersAPI.search(q.trim())
        .then((res) => setResults(res.data))
        .catch((error) => console.error("Search Error:", error))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [q]);

  const saveRecent = (term) => {
    const next = [term, ...recents.filter((r) => r !== term)].slice(0, 8);
    setRecents(next);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
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
      <h1 className="font-display text-3xl font-bold">Search</h1>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => q.trim() && saveRecent(q.trim())}
          placeholder="Search users…"
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-11 text-sm outline-none ring-ring focus:ring-2"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!q && recents.length > 0 && (
        <div className="rounded-3xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>Recent</span>
            <button
              onClick={() => {
                setRecents([]);
                localStorage.removeItem(RECENTS_KEY);
              }}
              className="normal-case text-foreground hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recents.map((r) => (
              <button
                key={r}
                onClick={() => setQ(r)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {q ? (
        loading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Searching…
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title="No users found"
            description={`No results for "${q}"`}
          />
        ) : (
          <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
            {results.map((u) => (
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
            ))}
          </div>
        )
      ) : !recents.length ? (
        <EmptyState
          title="Start typing to search"
          description="Find creators and friends by username."
        />
      ) : null}
    </div>
  );
}
