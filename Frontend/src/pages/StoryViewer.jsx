import { Link, useNavigate, useParams } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { StoriesAPI } from "@/services/stories";
import { UsersAPI } from "@/services/users";

export default function StoryViewer() {
  const { id } = useParams(); // id = story owner's user id
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [username, setUsername] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, [id]);

  const fetchStories = async () => {
    try {
      const [storiesRes, userRes] = await Promise.all([
        StoriesAPI.byUser(id),
        UsersAPI.getById(id),
      ]);

      setStories(storiesRes.data);
      setUsername(userRes.data.username);
    } catch (error) {
      console.error(error);
      navigate("/feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || stories.length === 0) return;

    setProgress(0);

    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + 2;
      });
    }, 100);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, loading, stories]);

  const goNext = () => {
    setIndex((i) => {
      if (i + 1 >= stories.length) {
        navigate("/feed");
        return i;
      }
      return i + 1;
    });
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  if (loading || stories.length === 0) return null;

  const current = stories[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur">
      <button
        onClick={() => navigate("/feed")}
        className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <button
        onClick={goPrev}
        className="absolute left-6 hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-16 hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-brand-soft shadow-elegant"
      >
        <img
          src={current.media_url}
          alt="Story"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-x-3 top-3 flex gap-1">
          {stories.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white"
                style={{
                  width:
                    i === index ? `${progress}%` : i < index ? "100%" : "0%",
                }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-4 top-8 flex items-center gap-2">
          <Avatar username={username} size="sm" />
          <span className="text-sm font-semibold text-white drop-shadow">
            @{username}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 backdrop-blur">
          <input
            placeholder="Reply to story…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
          />
          <Heart className="h-4 w-4 text-white" />
          <Send className="h-4 w-4 text-white" />
        </div>
      </motion.div>

      <Link to="/create-story" className="sr-only">
        Create story
      </Link>
    </div>
  );
}
