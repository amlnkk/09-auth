import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PATHS = ["/profile", "/notes"];
const AUTH_PATHS = ["/sign-in", "/sign-up"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Перевіряємо наявність токена в куках
  // Назву куки перевір у документації бекенду
  const allCookies = req.cookies.getAll();
  const hasToken = allCookies.some(
    (c) => c.name.includes("token") || c.name.includes("session"),
  );

  const isPrivate = PRIVATE_PATHS.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isPrivate && !hasToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuth && hasToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
