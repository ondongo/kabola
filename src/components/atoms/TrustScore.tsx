import { cn } from "@/utils/cn";
import { getTrustLevel } from "@/utils/format";
import { FiShield } from "react-icons/fi";

interface TrustScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeStyles = {
  sm: "text-xs gap-1",
  md: "text-sm gap-1.5",
  lg: "text-base gap-2",
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 18,
};

export default function TrustScore({
  score,
  size = "md",
  showLabel = false,
}: TrustScoreProps) {
  const level = getTrustLevel(score);

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium",
        sizeStyles[size],
        level.color,
      )}
    >
      <FiShield size={iconSizes[size]} />
      <span>{score}</span>
      {showLabel && <span className="text-text-secondary">· {level.label}</span>}
    </span>
  );
}
