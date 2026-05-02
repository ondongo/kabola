"use client";

import { useState } from "react";
import { PhoneNumberField } from "@/components/atoms/PhoneNumberField";

const labelProfile = "text-xs font-medium uppercase tracking-wider text-text-muted";

type Props = {
  defaultPhone: string;
};

export default function ProfilePhoneField({ defaultPhone }: Props) {
  const initial =
    defaultPhone.trim().startsWith("+") ? defaultPhone.trim() : undefined;
  const [value, setValue] = useState<string | undefined>(initial);

  return (
    <>
      <input type="hidden" name="phone" value={value ?? ""} readOnly />
      <PhoneNumberField
        id="profile-phone"
        label="Téléphone (Sénégal)"
        labelClassName={labelProfile}
        value={value}
        onChange={setValue}
      />
      <p className="text-xs leading-relaxed text-text-muted">
        Utile pour la vérification SMS et la confiance entre co-abonnés. Vous pouvez le confirmer
        dans « Vérifier mon téléphone ».
      </p>
    </>
  );
}
