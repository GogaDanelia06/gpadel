const TBC_TOKEN_URL = "https://api.tbcbank.ge/v1/tpay/access-token";
const TBC_ORDERS_URL = "https://api.tbcbank.ge/v1/tpay/orders";

interface TBCTokenResponse {
  access_token: string;
  expires_in: number;
}

interface TBCOrderResponse {
  payId: string;
  status: string;
  links: {
    redirect: string;
  };
}

async function getTBCToken(): Promise<string> {
  const apiKey = process.env.TBC_API_KEY;
  const secret = process.env.TBC_SECRET;

  if (!apiKey || !secret) {
    throw new Error("TBC credentials not configured");
  }

  const res = await fetch(TBC_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify({
      client_id: apiKey,
      client_secret: secret,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TBC auth failed: ${res.status} ${text}`);
  }

  const data: TBCTokenResponse = await res.json();
  return data.access_token;
}

export async function createTBCOrder(params: {
  externalOrderId: string;
  amount: number;
  baseUrl: string;
}): Promise<{ paymentUrl: string; orderId: string }> {
  const token = await getTBCToken();
  const apiKey = process.env.TBC_API_KEY!;

  const body = {
    amount: {
      currency: "GEL",
      total: params.amount,
      subtotal: params.amount,
    },
    returnUrl: `${params.baseUrl}/payment/success?orderId=${params.externalOrderId}`,
    callbackUrl: `${params.baseUrl}/api/payment/callback?provider=tbc&orderId=${params.externalOrderId}`,
    extra: params.externalOrderId,
  };

  const res = await fetch(TBC_ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TBC order creation failed: ${res.status} ${text}`);
  }

  const data: TBCOrderResponse = await res.json();
  return {
    paymentUrl: data.links.redirect,
    orderId: data.payId,
  };
}
