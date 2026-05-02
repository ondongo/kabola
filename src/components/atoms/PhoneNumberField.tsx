"use client";

import PhoneInput from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import fr from "react-phone-number-input/locale/fr.json";
import "react-phone-number-input/style.css";
import { cn } from "@/utils/cn";

/** Congo (CG), Sénégal (SN), Gabon (GA), France (FR) */
export const KABOLA_PHONE_COUNTRIES: Country[] = ["CG", "SN", "GA", "FR"];

type Props = {
  label?: string;
  labelClassName?: string;
  error?: string;
  id?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  /** Par défaut : Congo, Sénégal, Gabon, France uniquement */
  countries?: Country[];
};

export function PhoneNumberField({
  label,
  labelClassName,
  error,
  id,
  value,
  onChange,
  disabled,
  countries = KABOLA_PHONE_COUNTRIES,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={id}
          className={labelClassName ?? "text-sm font-medium text-gray-700"}
        >
          {label}
        </label>
      ) : null}
      <PhoneInput
        international
        countries={countries}
        defaultCountry="SN"
        labels={fr}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-base text-text outline-none transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          error ? "border-danger focus-within:border-danger focus-within:ring-danger/20" : null,
        )}
        numberInputProps={{
          className:
            "min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-text outline-none placeholder:text-text-muted",
        }}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
