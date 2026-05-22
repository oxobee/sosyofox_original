import { describe, expect, it } from "vitest";
import { calculateOrderTotals, calculateUnitPrice } from "../src/lib/pricing/pricing";

describe("pricing", () => {
  it("applies percentage profit", () => {
    expect(calculateUnitPrice({ originalRate: 100, profitType: "PERCENTAGE", profitValue: 30 })).toBe(130);
  });

  it("protects minimum profit and totals", () => {
    const totals = calculateOrderTotals({
      originalRate: 10,
      profitType: "FIXED",
      profitValue: 1,
      minimumProfit: 2,
      quantity: 3
    });
    expect(totals.unitPrice).toBe(12);
    expect(totals.totalPrice).toBe(36);
    expect(totals.netProfit).toBe(6);
  });
});
