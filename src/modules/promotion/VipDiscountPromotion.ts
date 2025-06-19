import { Cart } from "@modules/cart/models/Cart";
import { Promotion, PromotionResult } from "./models/Promotion";

export class VIPDiscountPromotion implements Promotion {
  private static readonly DISCOUNT_RATE = 0.15; // 15% discount

  getName(): string {
    return "VIP Discount (15%)";
  }
  apply(cart: Cart): PromotionResult {
    if (cart.getUserType() !== "VIP") {
      throw new Error(`VIPDiscountPromotion can only be applied to VIP carts`);
    }

    const subtotal = cart
      .getItems()
      .reduce((acc, item) => acc + item.getSubtotal(), 0);

    const discount = subtotal * VIPDiscountPromotion.DISCOUNT_RATE;
    const total = parseFloat((subtotal - discount).toFixed(2));

    return {
      total,
      appliedPromotion: this.getName(),
    };
  }
}
