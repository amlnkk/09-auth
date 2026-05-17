import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_PATHS = ["/profile", "/notes"];
const AUTH_PATHS = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  const isPrivate = PRIVATE_PATHS.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));

  let isAuthenticated = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      if (response) {
        isAuthenticated = true;
        const res = NextResponse.next();
        const setCookie = response.headers["set-cookie"];
        if (setCookie) {
          const cookieList = Array.isArray(setCookie) ? setCookie : [setCookie];
          cookieList.forEach((cookie) => {
            res.headers.append("set-cookie", cookie);
          });
        }
        return res;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuth && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
