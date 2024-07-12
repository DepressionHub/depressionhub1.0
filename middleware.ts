import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Middleware token:", token);

  if (!token && request.nextUrl.pathname === "/TherapistDashboard") {
    console.log("No token, redirecting to sign in");
    const url = request.nextUrl.clone();
    url.pathname = "/api/auth/signin";
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }

  console.log("Proceeding to next middleware or route handler");
  return NextResponse.next();
}

export const config = {
  matcher: ["/TherapistDashboard"],
};
