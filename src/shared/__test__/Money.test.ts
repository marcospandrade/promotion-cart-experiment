import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Money } from "../Money";

describe("Money", () => {
  test("creates money value with 2 decimal places", () => {
    const m = new Money(10.239);

    assert.equal(m.toNumber(), 10.24);
  });

  test("addition", () => {
    const a = new Money(10);
    const b = new Money(5.25);
    const result = a.add(b);

    assert.equal(result.toNumber(), 15.25);
  });

  test("subtraction", () => {
    const a = new Money(20);
    const b = new Money(4.75);
    const result = a.subtract(b);

    assert.equal(result.toNumber(), 15.25);
  });

  test("multiplication", () => {
    const a = new Money(10);
    const result = a.multiply(1.5);

    assert.equal(result.toNumber(), 15.0);
  });

  test("division", () => {
    const a = new Money(15);
    const result = a.divide(3);

    assert.equal(result.toString(), "$5.00");
  });

  test("equality check", () => {
    const a = new Money(10.12645);
    const b = new Money(10.1264);
    const c = new Money(10.12);

    assert.ok(a.equals(b));
    assert.ok(!a.equals(c));
  });

  test("throws on invalid number", () => {
    assert.throws(() => new Money(NaN), /Invalid monetary value/);
  });

  test("throws on division by zero", () => {
    const a = new Money(10);

    assert.throws(() => a.divide(0), /divide by zero/);
  });

  test("toString() outputs using Intl.NumberFormat", () => {
    const a = new Money(10.2);

    assert.equal(a.toString(), "$10.20");
  });
});
