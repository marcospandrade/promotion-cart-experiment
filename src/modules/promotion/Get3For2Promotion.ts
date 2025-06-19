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
    if (allPrices.length === 0) {
      return {
        total: 0,
        appliedPromotion: this.getName(),
      };
    }

    const numFreeItems = Math.floor(allPrices.length / 3);
    allPrices.sort((a, b) => b - a);
    allPrices.splice(-numFreeItems, numFreeItems);

    const total = allPrices.reduce((acc, price) => acc + price, 0);

    return {
      total: parseFloat(total.toFixed(2)),
      appliedPromotion: this.getName(),
    };
  }
}
