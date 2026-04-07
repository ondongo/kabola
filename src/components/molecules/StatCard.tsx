import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  color?: "primary" | "success" | "warning";
}

const colorStyles = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
};

const iconBgStyles = {
  primary: "bg-primary-light",
  success: "bg-success-light",
  warning: "bg-warning-light",
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  color = "primary",
}: StatCardProps) {
  return (
    <Card padding="sm" variant="default" className="flex items-center gap-3 min-w-0">
      {icon && (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            iconBgStyles[color],
            colorStyles[color],
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className={cn("text-lg font-bold truncate", colorStyles[color])}>
          {value}
        </p>
        <p className="text-xs text-text-muted truncate">{label}</p>
        {trend && (
          <p className="text-xs text-success font-medium">{trend}</p>
        )}
      </div>
    </Card>
  );
}
