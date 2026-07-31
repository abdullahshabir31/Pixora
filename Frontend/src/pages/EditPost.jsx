import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function EditPostPage() {
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/post/${id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-3xl font-bold">Edit post</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-gradient-brand-soft skeleton opacity-40" />
        <form className="rounded-3xl border border-border bg-surface p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Caption</span>
            <textarea rows={5} className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2 resize-none" />
          </label>
          <div className="flex justify-end gap-2">
            <button className="rounded-full border border-border px-5 py-2 text-sm font-medium">Cancel</button>
            <button className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-elegant">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
