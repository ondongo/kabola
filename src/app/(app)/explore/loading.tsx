import Skeleton from "@/components/atoms/Skeleton";

export default function ExploreLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-14 rounded-2xl" />
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-2xl" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}
