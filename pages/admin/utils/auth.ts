// utils/auth.ts

import { useEffect } from "react";
import { useRouter } from "next/router";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/auth/check");
      if (!response.ok) {
        router.push("/admin");
      }
    }
    checkAuth();
  }, [router]);
}
