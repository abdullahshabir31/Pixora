import { Link } from "react-router-dom";
import { Bell, Lock, User, Shield, LogOut, ChevronRight, Palette } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <Section title="Account">
        <Row icon={User} label="Edit profile" to="/edit-profile" />
        <Row icon={Lock} label="Change password" />
        <Row icon={Bell} label="Notifications" />
      </Section>

      <Section title="Appearance">
        <div className="flex items-center gap-3 p-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand-soft"><Palette className="h-4 w-4" /></div>
          <div className="flex-1 text-sm font-medium">Theme</div>
          <div className="flex rounded-full border border-border bg-background p-1">
            {["light", "dark"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${theme === t ? "bg-gradient-brand text-primary-foreground" : "text-muted-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Privacy">
        <Row icon={Shield} label="Blocked users" to="/settings/blocked" />
        <Row icon={Lock} label="Private account" trailing={<Toggle />} />
      </Section>

      <Section title="Session">
        <Row icon={LogOut} label="Log out" to="/login" danger />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="rounded-3xl border border-border bg-surface divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, to, danger, trailing }) {
  const cls = `flex w-full items-center gap-3 p-4 text-left hover:bg-accent/40 ${danger ? "text-destructive" : ""}`;
  const inner = (
    <>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand-soft"><Icon className="h-4 w-4" /></div>
      <div className="flex-1 text-sm font-medium">{label}</div>
      {trailing ?? <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </>
  );
  return to ? <Link to={to} className={cls}>{inner}</Link> : <button className={cls}>{inner}</button>;
}

function Toggle() {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" className="peer sr-only" />
      <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-gradient-brand relative transition-colors">
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}
