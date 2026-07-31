import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

export function UserRow({ name }) {
  return (
    <div className="flex items-center justify-between p-4">
      <Link to={`/profile/${name}`} className="flex items-center gap-3">
        <Avatar username={name} />
        <div>
          <div className="text-sm font-semibold">@{name}</div>
          <div className="text-xs text-muted-foreground">Full Name</div>
        </div>
      </Link>
      <button className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-accent">Following</button>
    </div>
  );
}
