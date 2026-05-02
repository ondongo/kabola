import { redirect } from "next/navigation";
import { buildLoginHref } from "@/constants/routes.constants";

type Props = {
  searchParams: Promise<{ next?: string | string[] }>;
};

/** Ancienne route : redirige vers l’accueil avec ouverture de la modal de connexion. */
export default async function LoginPageRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  redirect(buildLoginHref(next));
}
