"use client";

import {
  SiNetflix,
  SiSpotify,
  SiCanva,
  SiApplemusic,
  SiHbo,
  SiNotion,
  SiNordvpn,
  SiFigma,
} from "react-icons/si";
import { FiTv, FiFilm, FiMusic, FiCloud, FiPlay, FiHeadphones, FiBox, FiPenTool, FiCast } from "react-icons/fi";
import type { IconType } from "react-icons";

interface ServiceConfig {
  icon: IconType;
  color: string;
  bg: string;
}

const SERVICE_ICONS: Record<string, ServiceConfig> = {
  netflix: { icon: SiNetflix, color: "#E50914", bg: "bg-red-50" },
  spotify: { icon: SiSpotify, color: "#1DB954", bg: "bg-green-50" },
  iptv: { icon: FiCast, color: "#4338CA", bg: "bg-violet-50" },
  canva: { icon: SiCanva, color: "#00C4CC", bg: "bg-cyan-50" },
  "canva pro": { icon: SiCanva, color: "#00C4CC", bg: "bg-cyan-50" },
  "canva pro team": { icon: SiCanva, color: "#00C4CC", bg: "bg-cyan-50" },
  "canal+": { icon: FiTv, color: "#1a1a2e", bg: "bg-gray-100" },
  "apple music": { icon: SiApplemusic, color: "#FC3C44", bg: "bg-pink-50" },
  deezer: { icon: FiHeadphones, color: "#A238FF", bg: "bg-purple-50" },
  "amazon prime": { icon: FiBox, color: "#00A8E1", bg: "bg-sky-50" },
  hbo: { icon: SiHbo, color: "#8B5CF6", bg: "bg-violet-50" },
  notion: { icon: SiNotion, color: "#000000", bg: "bg-gray-100" },
  nordvpn: { icon: SiNordvpn, color: "#4687FF", bg: "bg-blue-50" },
  figma: { icon: SiFigma, color: "#F24E1E", bg: "bg-orange-50" },
  adobe: { icon: FiPenTool, color: "#FF0000", bg: "bg-red-50" },
};

function getServiceConfig(name: string): ServiceConfig {
  const key = name.toLowerCase().trim();
  if (SERVICE_ICONS[key]) return SERVICE_ICONS[key];

  for (const [k, v] of Object.entries(SERVICE_ICONS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }

  const fallbacks: Record<string, ServiceConfig> = {
    VIDEO: { icon: FiFilm, color: "#6366F1", bg: "bg-indigo-50" },
    MUSIC: { icon: FiMusic, color: "#8B5CF6", bg: "bg-violet-50" },
    CLOUD: { icon: FiCloud, color: "#3B82F6", bg: "bg-blue-50" },
  };

  return fallbacks.VIDEO;
}

interface ServiceIconProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  showBg?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 16, container: "h-8 w-8" },
  md: { icon: 20, container: "h-10 w-10" },
  lg: { icon: 24, container: "h-12 w-12" },
  xl: { icon: 32, container: "h-16 w-16" },
};

export default function ServiceIcon({
  name,
  size = "md",
  showBg = true,
  className = "",
}: ServiceIconProps) {
  const config = getServiceConfig(name);
  const Icon = config.icon;
  const { icon: iconSize, container } = sizeMap[size];

  if (!showBg) {
    return <Icon size={iconSize} style={{ color: config.color }} className={className} />;
  }

  return (
    <div className={`flex items-center justify-center rounded-xl ${config.bg} ${container} ${className}`}>
      <Icon size={iconSize} style={{ color: config.color }} />
    </div>
  );
}

export function ServiceIconInline({ name, size = 18 }: { name: string; size?: number }) {
  const config = getServiceConfig(name);
  const Icon = config.icon;
  return <Icon size={size} style={{ color: config.color }} />;
}

export { getServiceConfig };
