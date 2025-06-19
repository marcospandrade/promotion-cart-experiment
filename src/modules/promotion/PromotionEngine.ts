import { Promotion, PromotionResult } from "./models/Promotion";
import { Cart } from "@modules/cart/models/Cart";

export class PromotionEngine {
  constructor(private readonly promotions: Promotion[]) {}

  applyBest(cart: Cart): PromotionResult {
    const applicable: PromotionResult[] = [];

    for (const promo of this.promotions) {
      try {
        const result = promo.apply(cart);
        applicable.push(result);
      } catch {
        // silently skip
      }
    }

    if (applicable.length > 0) {
      return applicable.reduce((best, current) =>
        current.total < best.total ? current : best
      );
    }

    const fallbackTotal = cart
      .getItems()
      .reduce((acc, item) => acc + item.getSubtotal(), 0);

    return {
      total: parseFloat(fallbackTotal.toFixed(2)),
      appliedPromotion: "No Promotion",
    };
  }
}
