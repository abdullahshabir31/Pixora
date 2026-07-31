import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send, Smile, Image as ImageIcon, Mic, Phone, Video } from "lucide-react";
import { Avatar } from "@/components/Avatar";

const messages = [
  { me: false, text: "Hey! Loved your latest post 💫" },
  { me: true, text: "Thanks!! took forever to edit haha" },
  { me: false, text: "It shows — the colors are incredible" },
  { me: true, text: "Working on a reel next, will send preview" },
  { me: false, text: "Yesss can't wait 🙌" },
];

export default function ConversationPage() {
  const { id } = useParams();
  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col rounded-3xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/chats" className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Avatar username={`friend${id}`} storyRing />
          <div>
            <div className="text-sm font-semibold">@friend_{id}</div>
            <div className="text-[11px] text-muted-foreground">Active now</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"><Phone className="h-4 w-4" /></button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"><Video className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.me ? "bg-gradient-brand text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
          <button className="p-2 text-muted-foreground hover:text-foreground"><Smile className="h-4 w-4" /></button>
          <input placeholder="Message…" className="flex-1 bg-transparent py-2 text-sm outline-none" />
          <button className="p-2 text-muted-foreground hover:text-foreground"><ImageIcon className="h-4 w-4" /></button>
          <button className="p-2 text-muted-foreground hover:text-foreground"><Mic className="h-4 w-4" /></button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
