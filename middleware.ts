import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
