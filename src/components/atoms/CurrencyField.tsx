"use client";

import CurrencyInput from "react-currency-input-field";
import { cn } from "@/utils/cn";

type Props = {
  label?: string;
  error?: string;
  id?: string;
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
};

export function CurrencyField({ label, error, id, value, onValueChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <CurrencyInput
        id={id}
        decimalsLimit={0}
        allowNegativeValue={false}
        suffix=" FCFA"
        groupSeparator=" "
        decimalSeparator=","
        value={value}
        disabled={disabled}
        onValueChange={(_v, _n, values) => {
          const n = values?.float;
          onValueChange(
            n != null && Number.isFinite(n) ? Math.round(n) : 0,
          );
        }}
        className={cn(
          "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
          error ? "border-danger focus:border-danger focus:ring-danger/20" : null,
        )}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
