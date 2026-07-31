import { Outlet } from "react-router-dom";
import { Sidebar, TopBar, BottomNav } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main className="lg:pl-72 pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-5xl px-4 lg:px-8 py-6">
          <Outlet />
          <Footer />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
