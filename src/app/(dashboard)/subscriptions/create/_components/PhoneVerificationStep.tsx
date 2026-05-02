"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  linkWithCredential,
} from "firebase/auth";
import { isValidPhoneNumber } from "react-phone-number-input";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { PhoneNumberField } from "@/components/atoms/PhoneNumberField";
import { getClientAuth } from "@/lib/firebase/auth";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";
import { syncPhoneVerifiedFromFirebaseAction } from "@/services/user.service";

type Props = {
  onVerified: () => void;
};

export default function PhoneVerificationStep({ onVerified }: Props) {
  const [phoneE164, setPhoneE164] = useState<string | undefined>(undefined);
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"phone" | "code">("phone");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const cleanupRecaptcha = useCallback(() => {
    try {
      recaptchaRef.current?.clear();
    } catch {
      /* ignore */
    }
    recaptchaRef.current = null;
  }, []);

  useEffect(() => () => cleanupRecaptcha(), [cleanupRecaptcha]);

  async function sendSms() {
    setError(null);
    if (!phoneE164 || !isValidPhoneNumber(phoneE164)) {
      setError("Indiquez un numéro mobile valide (avec indicatif).");
      return;
    }
    if (!isFirebaseClientConfigured()) {
      setError("Configuration Firebase manquante.");
      return;
    }

    setBusy(true);
    try {
      const auth = getClientAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("Vous devez être connecté.");
        setBusy(false);
        return;
      }

      cleanupRecaptcha();

      const verifier = new RecaptchaVerifier(auth, "recaptcha-kabola-phone", {
        size: "invisible",
      });
      recaptchaRef.current = verifier;

      const provider = new PhoneAuthProvider(auth);
      const vid = await provider.verifyPhoneNumber(phoneE164, verifier);
      setVerificationId(vid);
      setPhase("code");
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Impossible d’envoyer le SMS. Vérifiez le numéro et réessayez.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode() {
    if (!verificationId || code.length < 6) {
      setError("Saisissez le code reçu par SMS.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const auth = getClientAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("Session expirée.");
        setBusy(false);
        return;
      }

      const cred = PhoneAuthProvider.credential(verificationId, code.trim());
      await linkWithCredential(user, cred);

      const sync = await syncPhoneVerifiedFromFirebaseAction();
      if (!sync.success) {
        setError(
          typeof sync.error === "string"
            ? sync.error
            : "Numéro lié, mais erreur de profil. Réessayez.",
        );
        setBusy(false);
        return;
      }
      cleanupRecaptcha();
      onVerified();
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Code incorrect ou expiré.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-text-secondary">
        Pour votre première publication, nous devons confirmer votre numéro de téléphone
        (SMS gratuit). Cela sécurise votre compte et les échanges avec les
        co-abonnés.
      </p>

      <div id="recaptcha-kabola-phone" className="min-h-[1px]" aria-hidden />

      {phase === "phone" ? (
        <>
          <PhoneNumberField
            label="Numéro de téléphone"
            id="wizard-phone"
            value={phoneE164}
            onChange={setPhoneE164}
          />
          <p className="text-xs text-text-muted">
            Choisissez le pays si besoin — le numéro est normalisé au format international pour le
            SMS.
          </p>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button
            type="button"
            size="lg"
            className="w-full rounded-full bg-primary py-4 text-white hover:bg-primary-hover"
            disabled={busy}
            isLoading={busy}
            onClick={() => void sendSms()}
          >
            Recevoir le code par SMS
          </Button>
        </>
      ) : (
        <>
          <Input
            label="Code à 6 chiffres"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full border-primary text-primary hover:bg-primary-light"
              disabled={busy}
              onClick={() => {
                setPhase("phone");
                setCode("");
                setVerificationId(null);
                setError(null);
              }}
            >
              Modifier le numéro
            </Button>
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-full bg-primary py-4 text-white hover:bg-primary-hover"
              disabled={busy || code.length < 6}
              isLoading={busy}
              onClick={() => void confirmCode()}
            >
              Confirmer
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
