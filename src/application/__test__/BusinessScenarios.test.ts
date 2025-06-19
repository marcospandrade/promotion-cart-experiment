import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { CartPricingService } from "../CartPricingService";
import { Product } from "@modules/product/models/Product";
import { Cart, UserType } from "@modules/cart/models/Cart";
import { ProductRepository } from "@modules/product/ProductRepository";

const catalog: Record<string, Product> = {
  "T-shirt": new Product("T-shirt", 35.99),
  Jeans: new Product("Jeans", 65.5),
  Dress: new Product("Dress", 80.75),
};

const scenarios = [
  {
    label: "Common user with 3 T-shirts",
    userType: UserType.COMMON,
    cartItems: ["T-shirt", "T-shirt", "T-shirt"],
    expected: 71.98,
  },
  {
    label: "Common user with 2 T-shirts + 2 Jeans",
    userType: UserType.COMMON,
    cartItems: ["T-shirt", "T-shirt", "Jeans", "Jeans"],
    expected: 166.99,
  },
  {
    label: "VIP user with 3 Dresses",
    userType: UserType.VIP,
    cartItems: ["Dress", "Dress", "Dress"],
    expected: 161.5,
    expectedPromotion: "Get 3 for the Price of 2",
  },
  {
    label: "VIP user with 2 Jeans + 2 Dresses",
    userType: UserType.VIP,
    cartItems: ["Jeans", "Jeans", "Dress", "Dress"],
    expected: 227.0,
    expectedPromotion: "Get 3 for the Price of 2",
  },
  {
    label: "VIP user with 4 T-shirts + 1 Jeans",
    userType: UserType.VIP,
    cartItems: ["T-shirt", "T-shirt", "T-shirt", "T-shirt", "Jeans"],
    expected: 173.47,
    expectedPromotion: "Get 3 for the Price of 2",
  },
];

const fakeProductRepository: ProductRepository = {
  findByName: async (name: string) => catalog[name] || null,
  findAll: async () => Object.values(catalog),
};

describe("Business Scenarios (Spec Examples)", () => {
  const pricing = new CartPricingService(fakeProductRepository);

  for (const s of scenarios) {
    test(s.label, () => {
      const cart = new Cart(s.userType, "test-session");

      for (const name of s.cartItems) {
        cart.addProduct(catalog[name]);
      }

      const result = pricing.calculate(cart);

      assert.equal(
        parseFloat(result.total.toFixed(2)),
        s.expected,
        `Expected total ${s.expected}, got ${result.total}`
      );

      if (s.expectedPromotion) {
        assert.equal(
          result.appliedPromotion,
          s.expectedPromotion,
          `Expected promotion '${s.expectedPromotion}', got '${result.appliedPromotion}'`
        );
      }
    });
  }
});
