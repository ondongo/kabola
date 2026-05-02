"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDb,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/constants/app.constants";
import type { SubscriptionShare } from "@/types/subscription.types";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";

export function usePublicSubscriptions(max = 24) {
  const [items, setItems] = useState<SubscriptionShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseClientConfigured()) {
      queueMicrotask(() => {
        setItems([]);
        setLoading(false);
      });
      return;
    }
    const q = query(
      collection(getDb(), COLLECTIONS.subscriptions),
      orderBy("createdAt", "desc"),
      limit(60),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as object) }) as SubscriptionShare)
          .filter((s) => s.visibility === "public" && s.status === "active")
          .slice(0, max);
        setItems(rows);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [max]);

  return { items, loading };
}
