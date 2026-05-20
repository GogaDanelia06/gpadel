const BOG_AUTH_URL =
  "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_ORDERS_URL = "https://api.bog.ge/payments/v1/ecommerce/orders";

interface BOGTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface BOGOrderResponse {
  id: string;
  redirect_url: string;
  status: string;
}

async function getBOGToken(): Promise<string> {
  const clientId = process.env.BOG_CLIENT_ID;
  const clientSecret = process.env.BOG_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("BOG credentials not configured");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const res = await fetch(BOG_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BOG auth failed: ${res.status} ${text}`);
  }

  const data: BOGTokenResponse = await res.json();
  return data.access_token;
}

export async function createBOGOrder(params: {
  externalOrderId: string;
  amount: number;
  baseUrl: string;
}): Promise<{ paymentUrl: string; orderId: string }> {
  const token = await getBOGToken();

  const body = {
    callback_url: `${params.baseUrl}/api/payment/callback?provider=bog&orderId=${params.externalOrderId}`,
    external_order_id: params.externalOrderId,
    purchase_units: [
      {
        quantity: 1,
        unit_price: params.amount,
        product_id: "padel_court",
      },
    ],
    redirect_urls: {
      success: `${params.baseUrl}/payment/success?orderId=${params.externalOrderId}`,
      fail: `${params.baseUrl}/payment/fail?orderId=${params.externalOrderId}`,
    },
  };

  const res = await fetch(BOG_ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BOG order creation failed: ${res.status} ${text}`);
  }

  const data: BOGOrderResponse = await res.json();
  return {
    paymentUrl: data.redirect_url,
    orderId: data.id,
  };
}
