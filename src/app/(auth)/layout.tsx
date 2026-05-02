import Logo from "@/components/atoms/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-surface px-4 py-12">
      <div className="mb-8">
        <Logo size="xl" />
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
