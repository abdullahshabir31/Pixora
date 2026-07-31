import { Upload, ImageIcon } from "lucide-react";

export default function CreatePostPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Create a post</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface hover:border-brand-2 transition-colors">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand-soft text-foreground">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div className="mt-4 font-display text-lg font-semibold">Drop photos here</div>
          <div className="text-xs text-muted-foreground">or click to browse from your device</div>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-primary-foreground shadow-elegant">
            <Upload className="h-3.5 w-3.5" /> Select photo
          </span>
          <input type="file" accept="image/*" className="hidden" />
        </label>

        <form className="rounded-3xl border border-border bg-surface p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Caption</span>
            <textarea rows={5} placeholder="Write a caption…" className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2 resize-none" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Location</span>
            <input placeholder="Add a location" className="w-full rounded-2xl border border-border bg-input/40 py-3 px-4 text-sm outline-none ring-ring focus:ring-2" />
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-border p-4">
            <div className="text-sm">
              <div className="font-semibold">Hide like counts</div>
              <div className="text-xs text-muted-foreground">Only you will see likes on this post.</div>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="rounded-full border border-border px-5 py-2 text-sm font-medium">Save draft</button>
            <button className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-medium text-primary-foreground shadow-elegant">Share</button>
          </div>
        </form>
      </div>
    </div>
  );
}
