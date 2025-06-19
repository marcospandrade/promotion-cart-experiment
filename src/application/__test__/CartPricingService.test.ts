import { test } from "node:test";
import assert from "node:assert/strict";

import { Product } from "@modules/product/models/Product";
import { Cart, UserType } from "@modules/cart/models/Cart";
import { CartPricingService } from "../CartPricingService";
import { ProductRepository } from "@modules/product/ProductRepository";

const catalog: Record<string, Product> = {
  "T-shirt": new Product("T-shirt", 35.99, 1),
  Jeans: new Product("Jeans", 65.5, 2),
  Dress: new Product("Dress", 80.75, 3),
};

const fakeProductRepository: ProductRepository = {
  findByName: async (name: string) => catalog[name] || null,
  findAll: async () => Object.values(catalog),
};

test("calculates best price for VIP with multiple promotions", () => {
  const cart = new Cart(UserType.VIP, "test-session");
  cart.addProduct(new Product("Dress", 80.75));
  cart.addProduct(new Product("Dress", 80.75));
  cart.addProduct(new Product("Dress", 80.75));

  const pricing = new CartPricingService(fakeProductRepository);
  const result = pricing.calculate(cart);

  assert.equal(result.total, 161.5);
  assert.equal(result.appliedPromotion, "Get 3 for the Price of 2");
});
