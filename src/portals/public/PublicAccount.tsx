"use client";

import * as React from "react";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { useAuth, useNav } from "@/lib/store";

const emptySubscribe = () => () => {};

export function PublicAccount() {
  const { isAuthenticated, user } = useAuth();
  const { navigate } = useNav();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  React.useEffect(() => {
    if (mounted && (!isAuthenticated || !user)) {
      navigate("public", "auth");
    }
  }, [mounted, isAuthenticated, user, navigate]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm font-medium">Loading account dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      }
    >
      <AccountDashboard />
    </React.Suspense>
  );
}
