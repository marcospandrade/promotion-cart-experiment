import { Cart } from "@modules/cart/models/Cart";
import { PromotionEngine } from "@modules/promotion/PromotionEngine";
import { Get3For2Promotion } from "@modules/promotion/Get3For2Promotion";
import { VIPDiscountPromotion } from "@modules/promotion/VipDiscountPromotion";

export class CartPricingService {
  private readonly engine: PromotionEngine;

  constructor() {
    this.engine = new PromotionEngine([
      new Get3For2Promotion(),
      new VIPDiscountPromotion(),
    ]);
  }

  calculate(cart: Cart): {
    total: number;
    appliedPromotion: string;
  } {
    const result = this.engine.applyBest(cart);
    return {
      total: result.total,
      appliedPromotion: result.appliedPromotion,
    };
  }
}
