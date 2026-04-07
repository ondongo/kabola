import Skeleton from "@/components/atoms/Skeleton";

export default function MySubscriptionsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-5 w-32" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-28 rounded-2xl" />
    </div>
  );
}
