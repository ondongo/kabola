"use client";

import { Suspense } from "react";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { LoginModalHost } from "./LoginModalHost";
import { DownloadAppModalHost } from "./DownloadAppModalHost";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Suspense fallback={null}>
          <LoginModalHost />
          <DownloadAppModalHost />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}
