import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { Product } from "@modules/product/models/Product";
import { Cart, UserType } from "@modules/cart/models/Cart";

import { Get3For2Promotion } from "../Get3For2Promotion";
import { VIPDiscountPromotion } from "../VipDiscountPromotion";
import { PromotionEngine } from "../PromotionEngine";

describe("PromotionEngine", () => {
  const tShirt = new Product("T-shirt", 35.99);
  const jeans = new Product("Jeans", 65.5);
  const dress = new Product("Dress", 80.75);

  test("applies Get3For2Promotion for COMMON user", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(tShirt);
    cart.addProduct(tShirt);
    cart.addProduct(tShirt);

    const engine = new PromotionEngine([
      new Get3For2Promotion(),
      new VIPDiscountPromotion(),
    ]);

    const result = engine.applyBest(cart);

    assert.equal(result.total, 71.98);
    assert.equal(result.appliedPromotion, "Get 3 for the Price of 2");
  });

  test("selects best promotion for VIP user", () => {
    const cart = new Cart(UserType.VIP);
    cart.addProduct(dress);
    cart.addProduct(dress);
    cart.addProduct(dress);

    const engine = new PromotionEngine([
      new Get3For2Promotion(),
      new VIPDiscountPromotion(),
    ]);

    const result = engine.applyBest(cart);

    // 80.75 * 3 = 242.25 → 15% off = 205.91 vs. "3 for 2" = 161.50
    assert.equal(result.total, 161.5);
    assert.equal(result.appliedPromotion, "Get 3 for the Price of 2");
  });

  test("returns full price if no promotions apply", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(new Product("T-shirt", 35.99));

    const engine = new PromotionEngine([
      new VIPDiscountPromotion(), // Not applicable to COMMON
    ]);

    const result = engine.applyBest(cart);

    assert.equal(result.total, 35.99);
    assert.equal(result.appliedPromotion, "No Promotion");
  });

  test("returns full price if promotion offers no discount", () => {
    const cart = new Cart(UserType.VIP);
    cart.addProduct(tShirt);

    const engine = new PromotionEngine([new VIPDiscountPromotion()]);

    const expected = parseFloat((35.99 * 0.85).toFixed(2));
    const result = engine.applyBest(cart);

    assert.equal(result.total, expected);
    assert.equal(result.appliedPromotion, "VIP Discount (15%)");
  });
});
