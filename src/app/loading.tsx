import Skeleton from "@/components/atoms/Skeleton";

export default function RootLoading() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-24">
      <Skeleton className="h-12 w-48 rounded-xl" />
      <Skeleton className="h-4 w-64 max-w-full rounded-md" />
      <Skeleton className="h-48 w-full max-w-md rounded-2xl" />
    </div>
  );
}
