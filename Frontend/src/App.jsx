import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import { AppShell } from "@/layouts/AppShell";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Feed = lazy(() => import("@/pages/Feed"));
const Explore = lazy(() => import("@/pages/Explore"));
const Reels = lazy(() => import("@/pages/Reels"));
const Reel = lazy(() => import("@/pages/Reel"));
const Search = lazy(() => import("@/pages/Search"));
const Chats = lazy(() => import("@/pages/Chats"));
const Conversation = lazy(() => import("@/pages/Conversation"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Saved = lazy(() => import("@/pages/Saved"));
const CreatePost = lazy(() => import("@/pages/CreatePost"));
const CreateReel = lazy(() => import("@/pages/CreateReel"));
const CreateStory = lazy(() => import("@/pages/CreateStory"));
const StoryViewer = lazy(() => import("@/pages/StoryViewer"));
const PostDetail = lazy(() => import("@/pages/PostDetail"));
const EditPost = lazy(() => import("@/pages/EditPost"));
const Profile = lazy(() => import("@/pages/Profile"));
const Followers = lazy(() => import("@/pages/Followers"));
const Following = lazy(() => import("@/pages/Following"));
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const Settings = lazy(() => import("@/pages/Settings"));
const BlockedUsers = lazy(() => import("@/pages/BlockedUsers"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/reels/:id" element={<Reel />} />
              <Route path="/create-reel" element={<CreateReel />} />
              <Route path="/search" element={<Search />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chats/:id" element={<Conversation />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/create-story" element={<CreateStory />} />
              <Route path="/stories/:id" element={<StoryViewer />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route
                path="/profile/:username/followers"
                element={<Followers />}
              />
              <Route
                path="/profile/:username/following"
                element={<Following />}
              />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/blocked" element={<BlockedUsers />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
