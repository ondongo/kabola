import { redirect } from "next/navigation";
import { buildLoginHref } from "@/constants";
import { getSessionUid } from "@/lib/auth/session";
import { getUserProfileByUid } from "@/services/user.service";
import ProfileSidebar from "./_components/ProfileSidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const uid = await getSessionUid();
  if (!uid) redirect(buildLoginHref("/profile"));

  const profile = await getUserProfileByUid(uid);
  const created = profile?.createdAt as { toDate?: () => Date } | undefined;
  const memberSinceLabel = created?.toDate
    ? `Inscrit sur Kabola depuis le ${created.toDate().toLocaleDateString("fr-FR")}`
    : "Compte Kabola";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 md:flex-row md:gap-12 md:px-6 md:py-10">
        <ProfileSidebar
          displayName={profile?.displayName ?? null}
          photoURL={profile?.photoURL ?? null}
          trustScore={profile?.trustScore ?? 50}
          memberSinceLabel={memberSinceLabel}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
