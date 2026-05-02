import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-constants";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profile",
  "/payments",
  "/subscriptions/create",
  "/trust",
  "/messages",
  "/notifications",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME);
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (pathname.startsWith("/login") && session) {
    const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
    return NextResponse.redirect(new URL(next, request.url));
  }

  if (isProtected && !session) {
    const login = new URL("/", request.url);
    login.searchParams.set("login", "1");
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/payments/:path*",
    "/subscriptions/create/:path*",
    "/trust/:path*",
    "/messages",
    "/messages/:path*",
    "/notifications",
    "/notifications/:path*",
    "/login",
  ],
};
