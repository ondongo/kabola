import { Suspense } from "react";
import Navbar from "@/components/organisms/Navbar";

export default function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Suspense fallback={<div className="h-[72px] border-b border-border bg-white md:block" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 pb-28 md:pb-0">{children}</main>
    </div>
  );
}
