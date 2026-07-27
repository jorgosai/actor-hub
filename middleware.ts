import { NextResponse, type NextRequest } from "next/server";

// Leichter Login-Check per Session-Cookie (die echte Prüfung passiert serverseitig via getUserId)
export function middleware(req: NextRequest) {
  const hatSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  const istLogin = req.nextUrl.pathname.startsWith("/login");
  const istReset = req.nextUrl.pathname.startsWith("/reset");

  if (!hatSession && !istLogin && !istReset) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (hatSession && istLogin && !istReset) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
