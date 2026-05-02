import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import ProfilePhoneField from "./_components/ProfilePhoneField";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { getSessionUid } from "@/lib/auth/session";
import { getUserProfileByUid, updateUserProfile } from "@/services/user.service";
import { buildLoginHref } from "@/constants";

export const metadata: Metadata = {
  title: "Profil",
};

const labelProfile = "text-xs font-medium uppercase tracking-wider text-text-muted";

export default async function ProfilePage() {
  const uid = await getSessionUid();
  if (!uid) redirect(buildLoginHref("/profile"));

  const profile = await getUserProfileByUid(uid);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
          Informations personnelles
        </h1>
      </div>

      <Card padding="none" className="overflow-hidden shadow-sm ring-1 ring-black/[0.04]">
        <div className="flex flex-col gap-4 border-b border-border/80 bg-surface/60 px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
            La photo de profil et vos informations aident à rassurer les autres membres d’un
            groupe.
          </p>
          <div className="flex shrink-0 justify-start md:justify-end">
            <Avatar
              src={profile?.photoURL ?? null}
              alt={profile?.displayName ?? "Profil"}
              size="lg"
              className="ring-4 ring-white shadow-md"
            />
          </div>
        </div>

        <form action={updateUserProfile} className="space-y-10 px-6 py-8 md:px-8">
          <section className="space-y-5">
            <h2 className={labelProfile}>Identité</h2>
            <Input
              name="displayName"
              label="Prénom et nom (affiché)"
              labelClassName={labelProfile}
              defaultValue={profile?.displayName ?? ""}
              required
            />
            <Input
              name="bio"
              label="Bio (optionnel)"
              labelClassName={labelProfile}
              defaultValue={profile?.bio ?? ""}
              placeholder="Quelques mots sur vous…"
            />
          </section>

          <section className="space-y-5 border-t border-border/60 pt-10">
            <h2 className={labelProfile}>Coordonnées</h2>
            <ProfilePhoneField defaultPhone={profile?.phone ?? ""} />
            <input type="hidden" name="country" value={profile?.country ?? "SN"} />
          </section>

          <div className="border-t border-border/60 pt-8">
            <Button type="submit" className="w-full rounded-xl md:max-w-xs" size="lg">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
