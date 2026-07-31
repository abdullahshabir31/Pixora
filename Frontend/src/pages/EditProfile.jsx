import { Avatar } from "@/components/Avatar";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersAPI } from "@/services/users";
import { AuthAPI } from "@/services/auth";

const profileSchema = z.object({
  fullName: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  website: z.string().optional(),
  bio: z.string().max(150, "Bio must be 150 characters or fewer").optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

export default function EditProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      website: "",
      bio: "",
      gender: "",
      dateOfBirth: "",
      isPrivate: false,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await AuthAPI.me();
        const p = res.data;
        setEmail(p.email || "");
        setUsername(p.username || "");
        setAvatarSrc(p.profile_image || null);
        reset({
          fullName: p.full_name || "",
          username: p.username || "",
          website: p.website || "",
          bio: p.bio || "",
          gender: p.gender || "",
          dateOfBirth: p.date_of_birth || "",
          isPrivate: !!p.is_private,
        });
      } catch (error) {
        console.error("Failed to load profile", error);
        setServerError("Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [reset]);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarSrc(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const formData = new FormData();

      if (values.username) formData.append("username", values.username);
      formData.append("full_name", values.fullName || "");
      formData.append("bio", values.bio || "");
      formData.append("website", values.website || "");
      formData.append("gender", values.gender || "");
      if (values.dateOfBirth)
        formData.append("date_of_birth", values.dateOfBirth);
      formData.append("is_private", values.isPrivate ? "true" : "false");
      if (avatarFile) formData.append("profile_image", avatarFile);

      const res = await UsersAPI.update(formData);
      navigate(`/profile/${res.data.username}`);
    } catch (error) {
      console.error("Profile update failed", error);
      setServerError(
        error?.response?.data?.detail ||
          "Failed to update profile. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="font-display text-3xl font-bold">Edit profile</h1>
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft h-24 skeleton" />
        <div className="rounded-3xl border border-border bg-surface p-6 h-96 skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Edit profile</h1>

      {serverError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft flex items-center gap-4">
        <div className="relative">
          <Avatar username={username} src={avatarSrc} size="xl" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </div>
        <div>
          <div className="font-semibold">@{username}</div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 text-sm text-gradient-brand font-medium"
          >
            Change profile photo
          </button>
        </div>
      </div>

      <form
        className="rounded-3xl border border-border bg-surface p-6 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Field
          label="Full name"
          placeholder="Your name"
          {...register("fullName")}
        />
        <Field
          label="Username"
          placeholder="pixora_user"
          {...register("username")}
        />
        <Field
          label="Website"
          placeholder="https://"
          {...register("website")}
        />
        <TextArea
          label="Bio"
          placeholder="Tell the world about yourself"
          {...register("bio")}
        />
        <Field label="Email" value={email} disabled />
        <Field
          label="Gender"
          placeholder="Prefer not to say"
          {...register("gender")}
        />
        <Field label="Date of birth" type="date" {...register("dateOfBirth")} />

        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
          <div>
            <div className="text-sm font-semibold">Private account</div>
            <div className="text-xs text-muted-foreground">
              Only approved followers can see your posts.
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("isPrivate")}
            />
            <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-gradient-brand relative transition-colors">
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-elegant disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, placeholder, type = "text", ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
        {...inputProps}
      />
    </label>
  );
}

function TextArea({ label, placeholder, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <textarea
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2 resize-none"
        {...inputProps}
      />
    </label>
  );
}
