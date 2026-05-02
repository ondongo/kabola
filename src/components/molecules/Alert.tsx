import { cn } from "@/utils/cn";

type Variant = "info" | "success" | "warning" | "danger";

const styles: Record<Variant, string> = {
  info: "bg-primary-light text-primary border-primary/20",
  success: "bg-success-light text-dark-brand border-success/20",
  warning: "bg-warning-light text-amber-900 border-warning/30",
  danger: "bg-danger-light text-danger border-danger/20",
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        styles[variant],
        className,
      )}
      role="status"
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1 text-text/90" : ""}>{children}</div>
    </div>
  );
}
