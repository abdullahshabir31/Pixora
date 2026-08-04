import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Send, Bell } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/Empty";
import { NotificationsAPI } from "@/services/notifications";
import { UsersAPI } from "@/services/users";
import { timeAgo } from "@/lib/utils";

const iconFor = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  follow_request: UserPlus,
  message: Send,
};

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [senders, setSenders] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await NotificationsAPI.list();
      setNotifications(res.data);

      // Notifications only carry sender_id — resolve profiles for display.
      const senderIds = [...new Set(res.data.map((n) => n.sender_id))];
      const profiles = await Promise.all(
        senderIds.map((id) =>
          UsersAPI.getById(id)
            .then((r) => r.data)
            .catch(() => null),
        ),
      );
      setSenders(
        Object.fromEntries(profiles.filter(Boolean).map((u) => [u.id, u])),
      );
    } catch (error) {
      console.error("Notifications Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (notification) => {
    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n,
        ),
      );
      NotificationsAPI.markRead(notification.id).catch((error) =>
        console.error("Mark Read Error:", error),
      );
    }

    const sender = senders[notification.sender_id];

    if (
      (notification.type === "like" || notification.type === "comment") &&
      notification.post_id
    ) {
      navigate(`/post/${notification.post_id}`);
    } else if (
      (notification.type === "follow" ||
        notification.type === "follow_request") &&
      sender
    ) {
      navigate(`/profile/${sender.username}`);
    } else if (notification.type === "message") {
      navigate(`/chats/${notification.sender_id}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Notifications</h1>

      {loading ? (
        <div className="rounded-3xl border border-border bg-surface p-6 text-sm text-muted-foreground">
          Loading…
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Likes, comments, follows and messages will show up here."
          icon={<Bell className="h-6 w-6" />}
        />
      ) : (
        <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
          {notifications.map((n) => {
            const Icon = iconFor[n.type] || Bell;
            const sender = senders[n.sender_id];
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex w-full items-center gap-4 p-4 text-left hover:bg-accent/40 ${
                  !n.is_read ? "bg-accent/20" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar
                    username={sender?.username}
                    src={sender?.profile_image}
                  />
                  <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant">
                    <Icon className="h-3 w-3" />
                  </span>
                </div>
                <div className="flex-1 text-sm min-w-0">
                  <span className="text-foreground">{n.message}</span>
                  <div className="text-[11px] text-muted-foreground">
                    {timeAgo(n.created_at)}
                  </div>
                </div>
                {!n.is_read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-brand" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
