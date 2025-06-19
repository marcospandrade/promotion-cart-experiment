import { Promotion, PromotionResult } from "./models/Promotion";
import { Cart } from "@modules/cart/models/Cart";
import { CartItem } from "@modules/cart/models/CartItem";
import { Money } from "@shared/Money";

export class Get3For2Promotion implements Promotion {
  getName(): string {
    return "Get 3 for the Price of 2";
  }

  apply(cart: Cart): PromotionResult {
    const allPrices: Money[] = [];

    for (const item of cart.getItems()) {
      const unitPrice = new Money(item.getProduct().getPrice());
      for (let i = 0; i < item.getQuantity(); i++) {
        allPrices.push(unitPrice);
      }
    }

    const discountCount = Math.floor(allPrices.length / 3);

    const total = allPrices.reduce(
      (sum, price) => sum.add(price),
      new Money(0)
    );

    if (allPrices.length < 3) {
      return {
        total: total.toNumber(),
        appliedPromotion: "No promotion applied",
      };
    }

    const discount = allPrices
      .sort((a, b) => a.toNumber() - b.toNumber())
      .slice(0, discountCount)
      .reduce((sum, p) => sum.add(p), new Money(0));

    return {
      total: total.subtract(discount).toNumber(),
      appliedPromotion: this.getName(),
    };
  }
}
