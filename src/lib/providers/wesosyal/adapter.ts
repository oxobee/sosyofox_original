import { decryptSecret } from "@/lib/security/encryption";
import type {
  ProviderOrderRequest,
  ProviderOrderStatus,
  SocialGrowthProviderAdapter
} from "./types";

export class ProviderCredentialsMissingError extends Error {
  constructor() {
    super("API bağlantısı bekleniyor. Admin panelinden sağlayıcı anahtarı girilmeden senkronizasyon çalışmaz.");
  }
}

type AdapterConfig = {
  encryptedApiKey?: string | null;
  baseUrl?: string | null;
};

const defaultBaseUrl = "https://wesosyal.com/api/v2";

type RawService = {
  service?: string | number;
  name?: string;
  type?: string;
  category?: string;
  rate?: string | number;
  min?: string | number;
  max?: string | number;
  description?: string;
  dripfeed?: boolean | string | number;
  refill?: boolean | string | number;
  cancel?: boolean | string | number;
};

function boolish(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function parseProviderRate(value: unknown) {
  const normalized = typeof value === "string"
    ? value.includes(",")
      ? value.trim().replace(/\./g, "").replace(",", ".")
      : value.trim()
    : value;
  const numeric = Number(normalized ?? 0);
  if (!Number.isFinite(numeric)) return 0;

  // WeSosyal sends some unit prices as milli-TL values, e.g. 3120 means 3.12 TL.
  return numeric >= 1000 ? Number((numeric / 1000).toFixed(4)) : numeric;
}

function normalizeStatus(status: unknown): ProviderOrderStatus["status"] {
  const value = String(status ?? "").toLowerCase();
  if (["completed", "complete", "tamamlandı"].includes(value)) return "completed";
  if (["in progress", "processing", "partial", "işleniyor"].includes(value)) return "processing";
  if (["canceled", "cancelled", "iptal"].includes(value)) return "cancelled";
  if (["failed", "error", "hata"].includes(value)) return "failed";
  return "pending";
}

export class WesosyalAdapter implements SocialGrowthProviderAdapter {
  private readonly encryptedApiKey?: string | null;
  private readonly baseUrl?: string | null;

  constructor(config: AdapterConfig) {
    this.encryptedApiKey = config.encryptedApiKey;
    this.baseUrl = config.baseUrl;
  }

  private getApiKey() {
    if (!this.encryptedApiKey) throw new ProviderCredentialsMissingError();
    return decryptSecret(this.encryptedApiKey);
  }

  private async request<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
    const apiKey = this.getApiKey();
    const endpoint = this.baseUrl?.trim() || defaultBaseUrl;

    const form = new URLSearchParams();
    form.set("key", apiKey.trim());
    form.set("action", action);
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null && value !== "") form.set(key, String(value));
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: form,
      cache: "no-store"
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Sağlayıcı API JSON dönmedi. HTTP ${response.status}: ${text.slice(0, 160)}`);
    }

    if (!response.ok) throw new Error(`Sağlayıcı API hatası: ${response.status}`);
    if (data && typeof data === "object" && "error" in data) {
      throw new Error(`Sağlayıcı API hatası: ${String((data as { error: unknown }).error)}`);
    }

    return data as T;
  }

  async getBalance() {
    const data = await this.request<{ balance?: string | number } | number>("balance");
    if (typeof data === "number") return data;
    return Number(data.balance ?? 0);
  }

  async getServices() {
    const data = await this.request<RawService[]>("services");
    if (!Array.isArray(data)) throw new Error("Sağlayıcı servis listesi beklenen formatta değil.");

    return data.map((service) => ({
      serviceId: String(service.service ?? ""),
      categoryName: String(service.category ?? "Genel"),
      serviceName: String(service.name ?? `Servis ${service.service ?? ""}`),
      type: service.type,
      min: Number(service.min ?? 1),
      max: Number(service.max ?? 1),
      rate: parseProviderRate(service.rate),
      description: service.description,
      status: "active",
      dripfeed: boolish(service.dripfeed),
      refill: boolish(service.refill),
      cancel: boolish(service.cancel)
    })).filter((service) => service.serviceId && service.serviceName);
  }

  async getCategories() {
    const services = await this.getServices();
    return [...new Set(services.map((service) => service.categoryName))];
  }

  async createOrder(request: ProviderOrderRequest) {
    const data = await this.request<{ order?: string | number }>("add", {
      service: request.serviceId,
      link: request.link,
      quantity: request.quantity,
      ...(request.extraParams ?? {})
    });

    return {
      orderId: String(data.order ?? ""),
      raw: data
    };
  }

  async getOrderStatus(orderId: string) {
    const data = await this.request<{ status?: string; remains?: string | number }>("status", { order: orderId });
    return {
      orderId,
      status: normalizeStatus(data.status),
      remains: data.remains === undefined ? undefined : Number(data.remains),
      raw: data
    };
  }

  async getMultipleOrderStatus(orderIds: string[]) {
    const data = await this.request<Record<string, { status?: string; remains?: string | number } | string>>("status", { orders: orderIds.join(",") });
    return Object.entries(data).map(([orderId, value]) => {
      if (typeof value === "string") return { orderId, status: "failed" as const, raw: value };
      return {
        orderId,
        status: normalizeStatus(value.status),
        remains: value.remains === undefined ? undefined : Number(value.remains),
        raw: value
      };
    });
  }

  async validateService(serviceId: string) {
    const services = await this.getServices();
    return services.some((service) => service.serviceId === serviceId);
  }

  async syncServices() {
    return this.getServices();
  }

  async syncPrices() {
    return this.getServices();
  }

  async syncOrderStatuses(orderIds: string[]) {
    return this.getMultipleOrderStatus(orderIds);
  }
}
