import { Link } from "react-router-dom";
import logoMark from "@/assets/logo-mark.png";

const DOT_SIZES = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };
const TEXT_SIZES = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };

export function Logo({ size = "md", showText = true }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2">
      <img
        src={logoMark}
        alt="Pixora"
        className={`${DOT_SIZES[size]} w-auto object-contain transition-transform group-hover:rotate-6`}
      />
      {showText && (
        <span className={`${TEXT_SIZES[size]} font-display font-bold tracking-tight`}>
          Pi<span className="text-gradient-brand">x</span>ora
        </span>
      )}
    </Link>
  );
}
