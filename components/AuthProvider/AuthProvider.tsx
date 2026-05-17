"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
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
      .then((user) => {
        if (user) {
          setUser(user);
        } else if (isPrivate) {
          clearIsAuthenticated();
          router.push("/sign-in");
        }
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  if (loading && isPrivate) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
