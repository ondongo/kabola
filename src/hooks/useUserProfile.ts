"use client";

import { useEffect, useState } from "react";
import { getDb, doc, onSnapshot } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/constants/app.constants";
import type { UserProfile } from "@/types/user.types";
import { useAuth } from "@/hooks/useAuth";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isFirebaseClientConfigured()) {
      queueMicrotask(() => {
        setProfile(null);
        setLoading(false);
      });
      return;
    }
    const ref = doc(getDb(), COLLECTIONS.users, user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setProfile({ uid: snap.id, ...(snap.data() as Omit<UserProfile, "uid">) } as UserProfile);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return { profile, loading };
}
