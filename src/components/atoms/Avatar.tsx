import { cn } from "@/utils/cn";
import Image from "next/image";

export default function Avatar({
  src,
  alt,
  size = "md",
  className,
}: {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "sm" ? 32 : size === "lg" ? 56 : 40;
  if (!src) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-primary",
          size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm",
          className,
        )}
        aria-hidden
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={dim}
      height={dim}
      className={cn("shrink-0 rounded-full object-cover ring-2 ring-white", className)}
    />
  );
}
