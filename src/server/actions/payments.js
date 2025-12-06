"use server";

import { serverApiClient } from "../api-client";

/**
 * Create a checkout session for the Pro plan
 */
export async function createProPlanCheckoutSession() {
  const res = await serverApiClient("/api/v1/payments/pro-plan", {
    method: "POST",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.message || "Failed to create checkout session",
    };
  }

  return { success: true, data: data };
}
