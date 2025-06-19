import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { VIPDiscountPromotion } from "../VipDiscountPromotion";
import { Product } from "@modules/product/models/Product";
import { Cart, UserType } from "@modules/cart/models/Cart";

describe("VIPDiscountPromotion", () => {
  test("applies 15% discount on 1 product", () => {
    const product = new Product("Dress", 80.75);
    const cart = new Cart(UserType.VIP);
    cart.addProduct(product);

    const promo = new VIPDiscountPromotion();
    const result = promo.apply(cart);

    assert.equal(result.total, parseFloat((80.75 * 0.85).toFixed(2)));
    assert.equal(result.appliedPromotion, "VIP Discount (15%)");
  });

  test("applies 15% discount on multiple products", () => {
    const cart = new Cart(UserType.VIP);
    cart.addProduct(new Product("T-shirt", 35.99));
    cart.addProduct(new Product("Jeans", 65.5));
    cart.addProduct(new Product("Dress", 80.75));

    const expectedSubtotal = 35.99 + 65.5 + 80.75;
    const expectedTotal = parseFloat((expectedSubtotal * 0.85).toFixed(2));

    const promo = new VIPDiscountPromotion();
    const result = promo.apply(cart);

    assert.equal(result.total, expectedTotal);
  });

  test("returns 0 total when cart is empty", () => {
    const cart = new Cart(UserType.VIP);
    const promo = new VIPDiscountPromotion();

    const result = promo.apply(cart);

    assert.equal(result.total, 0);
  });

  test("does not apply to COMMON user (for safety)", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(new Product("Jeans", 65.5));

    const promo = new VIPDiscountPromotion();

    // Safety: If accidentally applied to COMMON, fallback is full price
    assert.throws(() => promo.apply(cart), {
      message: /VIPDiscountPromotion can only be applied to VIP carts/,
    });
  });
});
