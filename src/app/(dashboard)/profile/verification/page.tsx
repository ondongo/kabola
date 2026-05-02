import type { Metadata } from "next";
import ProfileVerificationPanel from "../_components/ProfileVerificationPanel";

export const metadata: Metadata = {
  title: "Vérification téléphone",
};

export default function ProfileVerificationPage() {
  return <ProfileVerificationPanel />;
}
