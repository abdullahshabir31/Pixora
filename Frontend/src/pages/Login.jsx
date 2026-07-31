import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { AuthAPI } from "@/services/auth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values) => {
    try {
      const response = await AuthAPI.login(values);

      localStorage.setItem("pixora-token", response.data.access_token);

      console.log(response.data);

      localStorage.setItem("pixora-token", response.data.access_token);

      window.location.href = "/feed";
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.detail || "Login failed.");
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
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Log in to continue to Pixora.
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Email
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@pixora.app"
                    className="w-full rounded-2xl border border-border bg-input/40 py-3 pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-border bg-input/40 py-3 pl-10 pr-10 text-sm outline-none ring-ring focus:ring-2"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </label>

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-border"
                    {...register("remember")}
                  />{" "}
                  Remember me
                </label>
                <a href="#" className="text-foreground hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-2xl bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {isSubmitting ? "Logging in…" : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to Pixora?{" "}
              <Link
                to="/register"
                className="font-medium text-foreground hover:underline"
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
