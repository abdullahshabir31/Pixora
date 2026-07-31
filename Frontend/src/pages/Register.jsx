import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, User, AtSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { AuthAPI } from "@/services/auth";

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, dots and underscores"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", username: "", email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      // Placeholder — wire this up to your FastAPI backend.
      await AuthAPI.register(values);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-elegant"
          >
            <h1 className="font-display text-3xl font-bold">Create your Pixora</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">A place for moments that matter.</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Field icon={User} label="Full name" placeholder="Your name" error={errors.fullName} {...register("fullName")} />
              <Field icon={AtSign} label="Username" placeholder="pixora_user" error={errors.username} {...register("username")} />
              <Field icon={Mail} label="Email" placeholder="you@pixora.app" type="email" error={errors.email} {...register("email")} />
              <Field
                icon={Lock}
                label="Password"
                placeholder="At least 8 characters"
                type="password"
                error={errors.password}
                {...register("password")}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-2xl bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="font-medium text-foreground hover:underline">Log in</Link>
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, placeholder, type = "text", error, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-border bg-input/40 py-3 pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2"
          {...inputProps}
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error.message}</p>}
    </label>
  );
}
