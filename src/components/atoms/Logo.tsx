import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
  /** Above-the-fold / LCP : charge le logo en priorité */
  priority?: boolean;
};

/** Hauteur d’affichage (largeur dérivée du ratio intrinsèque 1536×1024). */
const HEIGHT_CLASS = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-14",
} as const;

const INTRINSIC = { width: 100, height: 50 } as const;

export default function Logo({ size = "md", href = "/", className = "", priority = false }: LogoProps) {
  const logo = (
    <div className={`${HEIGHT_CLASS[size]} w-auto object-contain object-left select-none ${className}`}>
      <Image
        src="/images/logo.png"
        alt="Kabola"
        width={INTRINSIC.width}
        height={INTRINSIC.height}
        className="w-full h-full"
        priority={priority}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center shrink-0">
        {logo}
      </Link>
    );
  }

  return <span className="inline-flex items-center shrink-0">{logo}</span>;
}
