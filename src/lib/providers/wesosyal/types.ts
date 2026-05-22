export type ProviderService = {
  serviceId: string;
  categoryName: string;
  serviceName: string;
  type?: string;
  min: number;
  max: number;
  rate: number;
  description?: string;
  status?: string;
  dripfeed?: boolean;
  refill?: boolean;
  cancel?: boolean;
};

export type ProviderOrderRequest = {
  serviceId: string;
  link: string;
  quantity: number;
  extraParams?: Record<string, string | number | boolean | undefined>;
};

export type ProviderOrderResponse = {
  orderId: string;
  raw: unknown;
};

export type ProviderOrderStatus = {
  orderId: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "failed";
  remains?: number;
  raw: unknown;
};

export interface SocialGrowthProviderAdapter {
  getBalance(): Promise<number>;
  getServices(): Promise<ProviderService[]>;
  getCategories(): Promise<string[]>;
  createOrder(request: ProviderOrderRequest): Promise<ProviderOrderResponse>;
  getOrderStatus(orderId: string): Promise<ProviderOrderStatus>;
  getMultipleOrderStatus(orderIds: string[]): Promise<ProviderOrderStatus[]>;
  validateService(serviceId: string): Promise<boolean>;
  syncServices(): Promise<ProviderService[]>;
  syncPrices(): Promise<ProviderService[]>;
  syncOrderStatuses(orderIds: string[]): Promise<ProviderOrderStatus[]>;
}
