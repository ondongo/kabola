import Skeleton from "@/components/atoms/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <Skeleton className="h-36 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    </div>
  );
}
