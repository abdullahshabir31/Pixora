import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { ChatAPI } from "@/services/chat";
import { UsersAPI } from "@/services/users";
import { AuthAPI } from "@/services/auth";

export default function ConversationPage() {
  const { id } = useParams();

  const [otherUser, setOtherUser] = useState(null);
  const [myId, setMyId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    loadConversation();

    // Poll for new messages every 4s so the chat feels live without websockets.
    const interval = setInterval(() => fetchMessages(), 4000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    try {
      const [meRes, userRes] = await Promise.all([
        AuthAPI.me(),
        UsersAPI.getById(id),
      ]);

      setMyId(meRes.data.id);
      setOtherUser(userRes.data);

      await fetchMessages();
    } catch (error) {
      console.error("Conversation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await ChatAPI.messages(id);
      setMessages(res.data);
    } catch (error) {
      console.error("Messages Error:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;

    setSending(true);
    setText("");

    try {
      await ChatAPI.send({
        receiver_id: Number(id),
        content,
        message_type: "text",
      });
      await fetchMessages();
    } catch (error) {
      console.error("Send Message Error:", error);
      alert(error.response?.data?.detail || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-9rem)] items-center justify-center rounded-3xl border border-border bg-surface text-sm text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col rounded-3xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/chats"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Avatar
            username={otherUser?.username}
            src={otherUser?.profile_image}
            storyRing
          />
          <div>
            <div className="text-sm font-semibold">@{otherUser?.username}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Say hi to @{otherUser?.username} 👋
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id === myId;
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMe
                      ? "bg-gradient-brand text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  } ${m.is_deleted ? "italic opacity-60" : ""}`}
                >
                  {m.message_type === "image" && !m.is_deleted ? (
                    <img
                      src={m.file_url}
                      alt={m.file_name || "image"}
                      className="max-w-full rounded-xl"
                    />
                  ) : m.message_type === "video" && !m.is_deleted ? (
                    <video
                      src={m.file_url}
                      controls
                      className="max-w-full rounded-xl"
                    />
                  ) : m.message_type !== "text" && !m.is_deleted ? (
                    <a
                      href={m.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {m.file_name || "Attachment"}
                    </a>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message…"
            className="flex-1 bg-transparent py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
