import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Lock,
  User,
  Shield,
  LogOut,
  ChevronRight,
  Palette,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { AuthAPI } from "@/services/auth";
import { UsersAPI } from "@/services/users";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [isPrivate, setIsPrivate] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    AuthAPI.me()
      .then((res) => setIsPrivate(!!res.data.is_private))
      .catch((error) => console.error("Settings Error:", error));
  }, []);

  const handleTogglePrivate = async () => {
    const next = !isPrivate;
    setIsPrivate(next);
    setPrivacyLoading(true);

    try {
      const formData = new FormData();
      formData.append("is_private", next ? "true" : "false");
      await UsersAPI.update(formData);
    } catch (error) {
      console.error("Privacy Update Error:", error);
      setIsPrivate(!next);
      alert(error?.response?.data?.detail || "Could not update privacy.");
    } finally {
      setPrivacyLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword) {
      setPasswordError("Both fields are required.");
      return;
    }

    setPasswordSaving(true);
    try {
      await AuthAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Change Password Error:", error);
      setPasswordError(
        error?.response?.data?.detail || "Failed to change password.",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pixora-token");
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <Section title="Account">
        <Row icon={User} label="Edit profile" to="/edit-profile" />
        <button
          onClick={() => setShowPasswordForm((v) => !v)}
          className="flex w-full items-center gap-3 p-4 text-left hover:bg-accent/40"
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand-soft">
            <Lock className="h-4 w-4" />
          </div>
          <div className="flex-1 text-sm font-medium">Change password</div>
          <ChevronRight
            className={`h-4 w-4 text-muted-foreground transition-transform ${showPasswordForm ? "rotate-90" : ""}`}
          />
        </button>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-3 p-4 pt-0">
            {passwordError && (
              <p className="text-xs text-destructive">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-xs text-emerald-600">{passwordSuccess}</p>
            )}
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-input/40 py-2.5 px-4 text-sm outline-none ring-ring focus:ring-2"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-input/40 py-2.5 px-4 text-sm outline-none ring-ring focus:ring-2"
            />
            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full rounded-full bg-gradient-brand py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {passwordSaving ? "Saving…" : "Update password"}
            </button>
          </form>
        )}

        <Row icon={Bell} label="Notifications" to="/notifications" />
      </Section>

      <Section title="Appearance">
        <div className="flex items-center gap-3 p-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand-soft">
            <Palette className="h-4 w-4" />
          </div>
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
        <Row
          icon={Lock}
          label="Private account"
          trailing={
            <Toggle
              checked={isPrivate}
              disabled={privacyLoading}
              onChange={handleTogglePrivate}
            />
          }
        />
      </Section>

      <Section title="Session">
        <Row icon={LogOut} label="Log out" onClick={handleLogout} danger />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="rounded-3xl border border-border bg-surface divide-y divide-border">
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, to, danger, trailing, onClick }) {
  const cls = `flex w-full items-center gap-3 p-4 text-left hover:bg-accent/40 ${danger ? "text-destructive" : ""}`;
  const inner = (
    <>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand-soft">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 text-sm font-medium">{label}</div>
      {trailing ?? <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-gradient-brand relative transition-colors">
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}
