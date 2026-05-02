import Skeleton from "@/components/atoms/Skeleton";

export default function LoginLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="mx-auto h-8 w-48 rounded-lg" />
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );
}
