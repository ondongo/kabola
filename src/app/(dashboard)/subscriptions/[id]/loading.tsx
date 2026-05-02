import Skeleton from "@/components/atoms/Skeleton";

export default function SubscriptionDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
    </div>
  );
}
