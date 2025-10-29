import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { SessionPayload } from "./types/session";

const secretKey = process.env.AUTH_SECRET;
const SESSION_COOKIE_NAME = "codex_session";

if (!secretKey) {
  throw new Error("AUTH_SECRET is not defined in the environment variables");
}
const key = new TextEncoder().encode(secretKey);

async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    if (new Date(payload.expiresAt as string) < new Date()) {
      return null;
    }

    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/books", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = "/dashboard";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(sessionCookie);
  const isAuthenticated = session !== null;

  const publicRoute = publicRoutes.find((route) => path.startsWith(route.path));

  if (!isAuthenticated) {
    if (!publicRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (isAuthenticated) {
    if (publicRoute && publicRoute.whenAuthenticated === "redirect") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE;
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};