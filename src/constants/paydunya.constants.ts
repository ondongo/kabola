export const PAYDUNYA_MODE = process.env.PAYDUNYA_MODE ?? "test";

export const PAYDUNYA_ENDPOINTS = {
  test: "https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create",
  live: "https://app.paydunya.com/api/v1/checkout-invoice/create",
} as const;

export const PAYDUNYA_CHECKOUT_BASE = {
  test: "https://app.paydunya.com/sandbox-checkout/invoice/",
  live: "https://app.paydunya.com/checkout/invoice/",
} as const;
