const sizes = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-28 w-28 text-3xl",
};

export function Avatar({ username, src, size = "md", ring = false, storyRing = false }) {
  const initials = (username || "?").slice(0, 2).toUpperCase();
  const inner = (
    <div
      className={`${sizes[size]} inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-brand font-semibold text-primary-foreground select-none`}
    >
      {src ? (
        <img src={src} alt={username || "avatar"} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
  if (storyRing) {
    return (
      <div className="rounded-full bg-gradient-brand p-[2px]">
        <div className="rounded-full bg-background p-[2px]">{inner}</div>
      </div>
    );
  }
  if (ring) {
    return <div className="rounded-full ring-2 ring-border p-[2px]">{inner}</div>;
  }
  return inner;
}
