import { motion } from "motion/react";
import logoMark from "@/assets/logo-mark.png";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <motion.img
        src={logoMark}
        alt="Pixora"
        className="h-14 w-14 object-contain"
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="font-display text-sm font-medium text-muted-foreground">Loading Pixora…</span>
    </div>
  );
}
