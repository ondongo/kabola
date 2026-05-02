import {
  PAYDUNYA_CHECKOUT_BASE,
  PAYDUNYA_ENDPOINTS,
  PAYDUNYA_MODE,
} from "@/constants/paydunya.constants";

function paydunyaHeaders(): Record<string, string> {
  const master = process.env.PAYDUNYA_MASTER_KEY;
  const priv = process.env.PAYDUNYA_PRIVATE_KEY;
  const token = process.env.PAYDUNYA_TOKEN;
  if (!master || !priv || !token) {
    throw new Error("Clés PayDunya manquantes (PAYDUNYA_MASTER_KEY, PAYDUNYA_PRIVATE_KEY, PAYDUNYA_TOKEN).");
  }
  return {
    "Content-Type": "application/json",
    "PAYDUNYA-MASTER-KEY": master,
    "PAYDUNYA-PRIVATE-KEY": priv,
    "PAYDUNYA-TOKEN": token,
  };
}

export type PayDunyaCheckoutPayload = {
  invoice: {
    total_amount: number;
    description: string;
    customer?: { name: string; email: string; phone: string };
  };
  store: { name: string; tagline?: string; phone?: string; logo_url?: string };
  custom_data?: Record<string, string>;
  actions?: {
    cancel_url?: string;
    return_url?: string;
    callback_url?: string;
  };
};

export type PayDunyaCreateResponse = {
  response_code: string;
  response_text: string;
  description?: string;
  token?: string;
};

export async function createCheckoutInvoice(
  payload: PayDunyaCheckoutPayload,
): Promise<PayDunyaCreateResponse> {
  const url =
    process.env.PAYDUNYA_BASE_URL?.trim() ||
    (PAYDUNYA_MODE === "live" ? PAYDUNYA_ENDPOINTS.live : PAYDUNYA_ENDPOINTS.test);
  const res = await fetch(url, {
    method: "POST",
    headers: paydunyaHeaders(),
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as PayDunyaCreateResponse;
  return json;
}

export function checkoutUrlFromToken(token: string): string {
  const base =
    PAYDUNYA_MODE === "live" ? PAYDUNYA_CHECKOUT_BASE.live : PAYDUNYA_CHECKOUT_BASE.test;
  return `${base}${token}`;
}

const CONFIRM_BASE = {
  test: "https://app.paydunya.com/sandbox-api/v1/checkout-invoice/confirm",
  live: "https://app.paydunya.com/api/v1/checkout-invoice/confirm",
} as const;

export type PayDunyaConfirmResponse = {
  response_code: string;
  response_text: string;
  hash?: string;
  invoice?: { token?: string; total_amount?: number };
  status?: string;
  mode?: string;
};

/** Confirmation serveur (source de vérité après réception d’un IPN). */
export async function confirmCheckoutInvoice(token: string): Promise<PayDunyaConfirmResponse> {
  const baseUrl =
    process.env.PAYDUNYA_CONFIRM_BASE_URL?.trim() ||
    (PAYDUNYA_MODE === "live" ? CONFIRM_BASE.live : CONFIRM_BASE.test);
  const url = `${baseUrl}/${encodeURIComponent(token)}`;
  const res = await fetch(url, { method: "GET", headers: paydunyaHeaders() });
  return (await res.json()) as PayDunyaConfirmResponse;
}

