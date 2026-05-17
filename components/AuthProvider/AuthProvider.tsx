"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";

const PRIVATE_PATHS = ["/profile", "/notes"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const isPrivate = PRIVATE_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    checkSession()
      .then(async (session) => {
        if (session) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivate) {
            router.push("/sign-in");
          }
        }
      })
      .catch(() => {
        clearIsAuthenticated();
        if (isPrivate) {
          router.push("/sign-in");
        }
      })
      .finally(() => setLoading(false));
  }, [pathname, isPrivate, setUser, clearIsAuthenticated, router]);

  if (loading && isPrivate) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
