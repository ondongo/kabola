import type { Metadata } from "next";
import { getSessionUid } from "@/lib/auth/session";
import { getUserProfileByUid } from "@/services/user.service";
import { listSubscriptionsForOwner } from "@/services/subscription.service";
import CreateSubscriptionWizard from "./_components/CreateSubscriptionWizard";

export const metadata: Metadata = {
  title: "Créer un partage",
};

export default async function CreateSubscriptionPage() {
  const uid = await getSessionUid();
  let initialPhoneVerified = false;
  if (uid) {
    const [profile, mine] = await Promise.all([
      getUserProfileByUid(uid),
      listSubscriptionsForOwner(uid),
    ]);
    initialPhoneVerified = Boolean(
      profile?.phoneVerified || (mine?.length ?? 0) > 0,
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-primary-light/40 via-white to-white">
      <CreateSubscriptionWizard initialPhoneVerified={initialPhoneVerified} />
    </div>
  );
}
