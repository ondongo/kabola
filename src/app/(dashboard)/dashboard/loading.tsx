import Skeleton from "@/components/atoms/Skeleton";

/** Affiché pendant la navigation vers le tableau de bord après connexion. */
export default function DashboardRouteLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <Skeleton className="h-32 rounded-2xl md:h-40" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Skeleton className="h-[220px] rounded-2xl" />
        <Skeleton className="h-[220px] rounded-2xl" />
      </div>
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
    </div>
  );
}
