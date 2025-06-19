import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Cart, UserType } from "../models/Cart";
import { Product } from "@modules/product/models/Product";

describe("Cart", () => {
  const tshirt = new Product("T-shirt", 35.99);

  test("adds product to cart", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(tshirt);

    const items = cart.getItems();
    assert.equal(items.length, 1);
    assert.equal(items[0].getQuantity(), 1);
  });

  test("increments quantity when adding same product again", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(tshirt);
    cart.addProduct(tshirt);

    assert.equal(cart.getItems().length, 1);
    assert.equal(cart.getItems()[0].getQuantity(), 2);
  });

  test("removes product (quantity = 1)", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(tshirt);
    cart.removeProduct(tshirt);

    assert.equal(cart.getItems().length, 0);
  });

  test("decrements product (quantity > 1)", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(tshirt);
    cart.addProduct(tshirt);
    cart.removeProduct(tshirt);

    assert.equal(cart.getItems().length, 1);
    assert.equal(cart.getItems()[0].getQuantity(), 1);
  });

  test("clear removes all items", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(tshirt);
    cart.addProduct(new Product("Jeans", 65.5));

    cart.clear();
    assert.equal(cart.getItems().length, 0);
  });

  test("totalItems returns correct sum", () => {
    const cart = new Cart(UserType.COMMON);
    cart.addProduct(tshirt);
    cart.addProduct(tshirt);
    cart.addProduct(new Product("Jeans", 65.5));

    assert.equal(cart.totalItems(), 3);
  });
});
