import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/Empty";
import { ChatAPI } from "@/services/chat";
import { timeAgo } from "@/lib/utils";

export default function ChatsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await ChatAPI.conversations();
      setConversations(res.data);
    } catch (error) {
      console.error("Conversations Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = conversations.filter((c) =>
    c.user.username.toLowerCase().includes(query.toLowerCase()),
  );

  const previewText = (message) => {
    if (!message) return "Say hi 👋";
    if (message.message_type === "text") return message.content;
    if (message.message_type === "image") return "📷 Photo";
    if (message.message_type === "video") return "🎥 Video";
    return "📎 File";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Messages</h1>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages…"
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none ring-ring focus:ring-2"
        />
      </div>

      <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No conversations yet"
              description="Messages you send and receive will show up here."
            />
          </div>
        ) : (
          filtered.map((c) => (
            <Link
              key={c.user.id}
              to={`/chats/${c.user.id}`}
              className="flex items-center gap-4 p-4 hover:bg-accent/40"
            >
              <Avatar username={c.user.username} src={c.user.profile_image} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    @{c.user.username}
                  </span>
                  {c.last_message && (
                    <span className="text-[11px] text-muted-foreground">
                      {timeAgo(c.last_message.created_at)}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {previewText(c.last_message)}
                </p>
              </div>
              {c.unread_count > 0 && (
                <span className="h-2 w-2 rounded-full bg-gradient-brand" />
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
