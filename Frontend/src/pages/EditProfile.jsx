import { Avatar } from "@/components/Avatar";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UsersAPI } from "@/services/users";

const profileSchema = z.object({
  fullName: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  website: z.string().optional(),
  bio: z.string().max(150, "Bio must be 150 characters or fewer").optional(),
  email: z.string().email("Enter a valid email").optional(),
  gender: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

export default function EditProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      website: "",
      bio: "",
      email: "",
      gender: "",
      isPrivate: false,
    },
  });

  const onSubmit = async (values) => {
    try {
      // Placeholder — wire this up to your FastAPI backend.
      await UsersAPI.update(values);
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Edit profile</h1>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft flex items-center gap-4">
        <div className="relative">
          <Avatar username="me" size="xl" />
          <button className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <div className="font-semibold">@me</div>
          <button className="mt-1 text-sm text-gradient-brand font-medium">Change profile photo</button>
        </div>
      </div>

      <form className="rounded-3xl border border-border bg-surface p-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Full name" placeholder="Your name" {...register("fullName")} />
        <Field label="Username" placeholder="pixora_user" {...register("username")} />
        <Field label="Website" placeholder="https://" {...register("website")} />
        <TextArea label="Bio" placeholder="Tell the world about yourself" {...register("bio")} />
        <Field label="Email" placeholder="you@pixora.app" type="email" {...register("email")} />
        <Field label="Gender" placeholder="Prefer not to say" {...register("gender")} />

        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
          <div>
            <div className="text-sm font-semibold">Private account</div>
            <div className="text-xs text-muted-foreground">Only approved followers can see your posts.</div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" {...register("isPrivate")} />
            <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-gradient-brand relative transition-colors">
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-border px-5 py-2 text-sm font-medium">Cancel</button>
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
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} placeholder={placeholder} className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2" {...inputProps} />
    </label>
  );
}

function TextArea({ label, placeholder, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <textarea rows={3} placeholder={placeholder} className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2 resize-none" {...inputProps} />
    </label>
  );
}
