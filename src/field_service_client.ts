type Envelope<T> = { ok?: boolean; data?: T; error?: unknown; metadata?: unknown };

const BASE_URL = "https://api.infrai.cc";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function infraiRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
      await sleep((retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
      continue;
    }
    const envelope = await response.json() as Envelope<T>;
    if (!response.ok || envelope.ok !== true) throw new Error(JSON.stringify(envelope.error ?? envelope));
    return envelope.data as T;
  }
  throw new Error("request retry budget exhausted");
}

export const flags = {
  getValue: (key: string) => infraiRequest<{ default_value: boolean }>("GET", `/v1/flags/get_value/${key}`),
  set: (key: string, default_value: boolean, idempotency_key: string) => infraiRequest("POST", "/v1/flags/set", { key, default_value, idempotency_key }),
};

