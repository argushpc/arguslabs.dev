import { cn } from "../lib/cn";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { mark: number; text: string; gap: string }> = {
  sm: { mark: 16, text: "text-[13px]", gap: "gap-2" },
  md: { mark: 19, text: "text-[15px]", gap: "gap-2.5" },
  lg: { mark: 24, text: "text-[19px]", gap: "gap-3" },
};

export function Wordmark({
  size = "md",
  className,
}: {
  size?: Size;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <Mark size={s.mark} />
      <span
        className={cn("font-extrabold text-zinc-50", s.text)}
        style={{ letterSpacing: "0.06em" }}
      >
        ARGUS
      </span>
    </span>
  );
}

export function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <rect x="2" y="14" width="4" height="8" rx="1" fill="#FF4FB5" />
      <rect x="10" y="9" width="4" height="13" rx="1" fill="#FF7A30" />
      <rect x="18" y="4" width="4" height="18" rx="1" fill="#2D5BFF" />
    </svg>
  );
}
