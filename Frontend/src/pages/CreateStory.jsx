import { Camera, Type, ImageIcon } from "lucide-react";

export default function CreateStoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">New story</h1>
      <div className="mx-auto aspect-[9/16] w-full max-w-sm rounded-3xl border-2 border-dashed border-border bg-surface flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-elegant">
          <Camera className="h-6 w-6" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold">Add to your story</div>
          <div className="text-xs text-muted-foreground">Share a photo, video or moment</div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-primary-foreground">
            <ImageIcon className="h-3.5 w-3.5" /> Photo
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium">
            <Type className="h-3.5 w-3.5" /> Text
          </button>
        </div>
      </div>
    </div>
  );
}
