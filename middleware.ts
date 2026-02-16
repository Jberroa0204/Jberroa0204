import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("neoxfortress_session")?.value;
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/new", "/submissions/:path*", "/admin/:path*"]
};
