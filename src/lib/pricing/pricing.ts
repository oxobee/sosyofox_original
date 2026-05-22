import { Prisma } from "@prisma/client";

export type PricingInput = {
  originalRate: Prisma.Decimal | number | string;
  quantity?: number;
  profitType?: "PERCENTAGE" | "FIXED";
  profitValue?: Prisma.Decimal | number | string;
  minimumProfit?: number;
  rounding?: "NONE" | "PSYCHOLOGICAL";
};

function toNumber(value: Prisma.Decimal | number | string | undefined, fallback = 0) {
  if (value === undefined || value === null) return fallback;
  return Number(value);
}

export function calculateUnitPrice(input: PricingInput) {
  const originalRate = toNumber(input.originalRate);
  const profitValue = toNumber(input.profitValue, 30);
  const minimumProfit = input.minimumProfit ?? 0;

  const raw =
    input.profitType === "FIXED"
      ? originalRate + profitValue
      : originalRate * (1 + profitValue / 100);

  const guarded = Math.max(raw, originalRate + minimumProfit);
  if (input.rounding === "PSYCHOLOGICAL" && guarded >= 10) {
    return Number((Math.ceil(guarded / 10) * 10 - 0.1).toFixed(2));
  }

  return Number(guarded.toFixed(4));
}

export function calculateAdjustedPrice(originalRate: Prisma.Decimal | number | string, percent: number) {
  const rate = toNumber(originalRate);
  return Number((rate * (1 + percent / 100)).toFixed(4));
}

export function calculateTotalsFromUnitPrice(input: {
  unitPrice: Prisma.Decimal | number | string;
  originalRate: Prisma.Decimal | number | string;
  quantity: number;
}) {
  const unitPrice = toNumber(input.unitPrice);
  const providerCost = Number((toNumber(input.originalRate) * input.quantity).toFixed(4));
  const totalPrice = Number((unitPrice * input.quantity).toFixed(2));
  const netProfit = Number((totalPrice - providerCost).toFixed(2));

  return { unitPrice, totalPrice, providerCost, netProfit };
}

export function calculateOrderTotals(input: PricingInput & { quantity: number }) {
  const unitPrice = calculateUnitPrice(input);
  const totalPrice = Number((unitPrice * input.quantity).toFixed(2));
  const providerCost = Number((toNumber(input.originalRate) * input.quantity).toFixed(4));
  const netProfit = Number((totalPrice - providerCost).toFixed(2));

  return { unitPrice, totalPrice, providerCost, netProfit };
}
