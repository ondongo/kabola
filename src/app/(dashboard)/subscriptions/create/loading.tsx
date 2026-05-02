import Skeleton from "@/components/atoms/Skeleton";

export default function CreateSubscriptionLoading() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
      <Skeleton className="h-10 w-2/3 rounded-lg" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}
