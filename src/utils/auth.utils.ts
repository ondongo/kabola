import { buildLoginHref, ROUTES } from "@/constants/routes.constants";

export function getLoginRedirectUrl(nextPath?: string | null): string {
  if (!nextPath || nextPath === ROUTES.HOME) return buildLoginHref();
  return buildLoginHref(nextPath);
}
