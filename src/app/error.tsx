"use client";

import { useEffect } from "react";
import Button from "@/components/atoms/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-xl font-bold text-text">Une erreur est survenue</h1>
      <p className="max-w-md text-text-secondary">
        {error.message || "Réessayez dans un instant."}
      </p>
      <Button type="button" onClick={() => reset()}>
        Réessayer
      </Button>
    </div>
  );
}
