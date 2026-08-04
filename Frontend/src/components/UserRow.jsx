import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

export function UserRow({
  userId,
  username,
  fullName,
  avatarSrc,
  isFollowing,
  isSelf,
  loading,
  onToggleFollow,
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <Link to={`/profile/${username}`} className="flex items-center gap-3">
        <Avatar username={username} src={avatarSrc} />
        <div>
          <div className="text-sm font-semibold">@{username}</div>
          {fullName && (
            <div className="text-xs text-muted-foreground">{fullName}</div>
          )}
        </div>
      </Link>

      {!isSelf && (
        <button
          onClick={() => onToggleFollow?.(userId)}
          disabled={loading}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
            isFollowing
              ? "border border-border hover:bg-accent"
              : "bg-gradient-brand text-primary-foreground"
          }`}
        >
          {loading ? "..." : isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}
