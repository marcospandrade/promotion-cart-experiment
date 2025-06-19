// src/modules/promotion/Get3For2Promotion.ts

import { Promotion, PromotionResult } from "./models/Promotion";
import { Cart } from "@modules/cart/models/Cart";
import { CartItem } from "@modules/cart/models/CartItem";

export class Get3For2Promotion implements Promotion {
  getName(): string {
    return "Get 3 for the Price of 2";
  }

  apply(cart: Cart): PromotionResult {
    const items = cart.getItems();

    const allPrices: number[] = [];

    for (const item of items) {
      const price = item.getProduct().getPrice();
      for (let i = 0; i < item.getQuantity(); i++) {
        allPrices.push(price);
      }
    }

    // Sort prices in descending order
    allPrices.sort((a, b) => b - a);
    // Calculate total, skipping every 3rd item (the cheapest in the group)
    let total = 0;
    for (let i = 0; i < allPrices.length; i++) {
      // skip every 3rd item (cheapest in group)
      if ((i + 1) % 3 !== 0) {
        total += allPrices[i];
      }
    }

    return {
      total: parseFloat(total.toFixed(2)),
      appliedPromotion: this.getName(),
    };
  }
}
