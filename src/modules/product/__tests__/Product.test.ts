import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Product } from "../models/Product";

describe("Product", () => {
  test("creates valid product", () => {
    const p = new Product("T-shirt", 35.99);
    assert.equal(p.getName(), "T-shirt");
    assert.equal(p.getPrice(), 35.99);
  });

  test("throws if name is empty", () => {
    assert.throws(() => new Product("", 10));
    assert.throws(() => new Product("   ", 10));
  });

  test("throws if price is not positive", () => {
    assert.throws(() => new Product("Shirt", 0));
    assert.throws(() => new Product("Shirt", -10));
  });

  test("equals returns true for same name and price", () => {
    const a = new Product("Jeans", 65.5);
    const b = new Product("Jeans", 65.5);
    assert.ok(a.equals(b));
  });

  test("equals returns false for different name or price", () => {
    const a = new Product("Jeans", 65.5);
    const b = new Product("Jeans", 70.0);
    const c = new Product("Dress", 65.5);

    assert.ok(!a.equals(b));
    assert.ok(!a.equals(c));
  });
});
