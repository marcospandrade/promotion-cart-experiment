import { test } from "node:test";
import assert from "node:assert/strict";

import { Product } from "@modules/product/models/Product";
import { Cart, UserType } from "@modules/cart/models/Cart";
import { CartPricingService } from "../CartPricingService";

test("calculates best price for VIP with multiple promotions", () => {
  const cart = new Cart(UserType.VIP);
  cart.addProduct(new Product("Dress", 80.75));
  cart.addProduct(new Product("Dress", 80.75));
  cart.addProduct(new Product("Dress", 80.75));

  const pricing = new CartPricingService();
  const result = pricing.calculate(cart);

  assert.equal(result.total, 161.5);
  assert.equal(result.appliedPromotion, "Get 3 for the Price of 2");
});
