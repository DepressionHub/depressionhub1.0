import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/TherapistDashboard", "/TherapistApply"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Middleware executed for path:", request.nextUrl.pathname);
  console.log("Token:", token);

  if (
    !token &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    console.log("Redirecting to signin page");
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  console.log("Proceeding to next middleware/page");
  return NextResponse.next();
}

export const config = {
  matcher: ["/TherapistDashboard/:path*", "/TherapistApply/:path*"],
};
