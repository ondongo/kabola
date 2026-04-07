import Navbar from "@/components/organisms/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
