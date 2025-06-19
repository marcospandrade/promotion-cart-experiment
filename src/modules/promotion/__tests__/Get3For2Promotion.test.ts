import { Get3For2Promotion } from "../Get3For2Promotion";
import { Cart, UserType } from "@modules/cart/models/Cart";
import { Product } from "@modules/product/models/Product";
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { Money } from "@shared/Money";

describe("Get3For2Promotion", () => {
  test('applies "3 for 2" rule correctly for 3 identical products', () => {
    const promo = new Get3For2Promotion();
    const product = new Product("T-shirt", 35.99);
    const cart = new Cart(UserType.COMMON);

    cart.addProduct(product);
    cart.addProduct(product);
    cart.addProduct(product);

    const result = promo.apply(cart);

    assert.ok(new Money(result.total).equals(new Money(71.98))); // 35.99 * 2
    assert.equal(result.appliedPromotion, "Get 3 for the Price of 2");
  });

  test("should apply no discount for 1 product", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(new Product("T-shirt", 35.99));

    const promo = new Get3For2Promotion();
    const result = promo.apply(cart);

    assert.ok(new Money(result.total).equals(new Money(35.99)));
  });

  test("should apply no discount for 2 products", () => {
    const cart = new Cart(UserType.COMMON);
    const product = new Product("T-shirt", 35.99);
    cart.addProduct(product);
    cart.addProduct(product);

    const promo = new Get3For2Promotion();
    const result = promo.apply(cart);

    assert.ok(new Money(result.total).equals(new Money(71.98))); // 35.99 * 2
  });

  test("should apply discount twice for 6 items", () => {
    const cart = new Cart(UserType.COMMON);
    const product = new Product("Jeans", 65.5);
    for (let i = 0; i < 6; i++) {
      cart.addProduct(product);
    }

    const promo = new Get3For2Promotion();
    const result = promo.apply(cart);

    assert.ok(new Money(result.total).equals(new Money(262))); // 65.5 * 4
  });

  test("should apply discount once and pay 1 leftover", () => {
    const cart = new Cart(UserType.COMMON);
    const product = new Product("Dress", 80.75);
    for (let i = 0; i <= 4; i++) {
      cart.addProduct(product);
    }

    const promo = new Get3For2Promotion();
    const result = promo.apply(cart);

    // 80.75 * 3 → one free in 3-for-2 group, + 1 full-price dress
    assert.ok(new Money(result.total).equals(new Money(242.25 + 80.75)));
  });

  test("should apply multiple group discounts on sorted prices", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(new Product("Dress", 80.75));
    cart.addProduct(new Product("Dress", 80.75));
    cart.addProduct(new Product("Jeans", 65.5));
    cart.addProduct(new Product("T-shirt", 35.99));
    cart.addProduct(new Product("T-shirt", 35.99));
    cart.addProduct(new Product("T-shirt", 35.99));

    const promo = new Get3For2Promotion();
    const result = promo.apply(cart);

    const expected = 80.75 * 2 + 65.5 + 35.99;
    assert.ok(
      new Money(result.total).equals(new Money(parseFloat(expected.toFixed(2))))
    );
  });

  test("should return 0 total for empty cart", () => {
    const cart = new Cart(UserType.COMMON);
    const promo = new Get3For2Promotion();
    const result = promo.apply(cart);

    assert.ok(new Money(result.total).equals(new Money(0)));
    assert.equal(result.appliedPromotion, "Get 3 for the Price of 2");
  });
});
