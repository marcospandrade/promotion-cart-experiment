import { Cart } from "@modules/cart/models/Cart";
import { Promotion, PromotionResult } from "./models/Promotion";
import { Money } from "@shared/Money";

export class VIPDiscountPromotion implements Promotion {
  private static readonly DISCOUNT_RATE = 0.15; // 15% discount

  getName(): string {
    return "VIP Discount (15%)";
  }
  apply(cart: Cart): PromotionResult {
    if (cart.getUserType() !== "VIP") {
      throw new Error("VIPDiscountPromotion can only be applied to VIP carts");
    }

    const subtotal = cart.getItems().reduce((sum, item) => {
      const itemTotal = new Money(item.getSubtotal());
      return sum.add(itemTotal);
    }, new Money(0));

    const discount = subtotal.multiply(VIPDiscountPromotion.DISCOUNT_RATE);
    const total = subtotal.subtract(discount);

    return {
      total: total.toNumber(),
      appliedPromotion: this.getName(),
    };
  }
}
