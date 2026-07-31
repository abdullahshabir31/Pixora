import { Link, useNavigate, useParams } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function StoryViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const t = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 100);
    return () => clearInterval(t);
  }, [id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur">
      <button onClick={() => navigate("/feed")} className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
        <X className="h-4 w-4" />
      </button>

      <button className="absolute left-6 hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button className="absolute right-16 hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
        <ChevronRight className="h-4 w-4" />
      </button>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-brand-soft shadow-elegant"
      >
        <div className="absolute inset-x-3 top-3 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white"
                style={{ width: i === Number(id) % 5 ? `${progress}%` : i < Number(id) % 5 ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-4 top-8 flex items-center gap-2">
          <Avatar username="creator" size="sm" />
          <span className="text-sm font-semibold text-white drop-shadow">@creator</span>
          <span className="text-xs text-white/70">{id}h ago</span>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 backdrop-blur">
          <input placeholder="Reply to story…" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none" />
          <Heart className="h-4 w-4 text-white" />
          <Send className="h-4 w-4 text-white" />
        </div>
      </motion.div>

      <Link to="/create-story" className="sr-only">Create story</Link>
    </div>
  );
}
