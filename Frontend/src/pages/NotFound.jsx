import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-3xl bg-gradient-brand shadow-elegant" />
        <h1 className="text-7xl font-display font-bold text-gradient-brand">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Lost in the feed</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-[1.03]"
        >
          Back to Pixora
        </Link>
      </div>
    </div>
  );
}
