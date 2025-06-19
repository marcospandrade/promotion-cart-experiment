import { test, describe } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../../main";

describe("🧪 Cart API Integration", () => {
  let agent = request.agent(app); // maintains cookies across requests

  test("adds item to cart and returns 200", async () => {
    const res = await agent
      .post("/api/cart/items")
      .send({ productName: "Jeans", quantity: 2, userType: "VIP" });

    assert.equal(res.status, 200);
    assert.match(res.body.message, /2x Jeans/);
  });

  test("returns cart total and applied promotion", async () => {
    const res = await agent.get("/api/cart/total").query({ userType: "VIP" });

    assert.equal(res.status, 200);
    assert.ok(res.body.total > 0);
    assert.ok(res.body.appliedPromotion);
  });

  test("clears the cart", async () => {
    const res = await agent.post("/api/cart/clear").send();

    assert.equal(res.status, 200);
    assert.equal(res.body.message, "Cart cleared.");
  });

  test("returns 0 total after clear", async () => {
    const res = await agent.get("/api/cart/total").query({ userType: "VIP" });

    assert.equal(res.status, 200);
    assert.equal(res.body.total, 0);
  });

  test("returns 404 when product does not exist", async () => {
    const res = await agent
      .post("/api/cart/items")
      .send({ productName: "Invisible Hat", quantity: 1, userType: "COMMON" });

    assert.equal(res.status, 404);
    assert.match(res.body.error, /not found/i);
  });

  test("returns 422 for invalid user type", async () => {
    const res = await agent
      .post("/api/cart/items")
      .send({ productName: "Jeans", quantity: 1, userType: "WIZARD" });

    assert.equal(res.status, 422);
  });

  test("returns 422 when quantity is invalid", async () => {
    const res = await agent
      .post("/api/cart/items")
      .send({ productName: "T-shirt", quantity: 0, userType: "VIP" });

    assert.equal(res.status, 422);
    assert.match(res.body.error, /Invalid payload/i);
  });

  test("correctly updates quantity for repeated products", async () => {
    await agent
      .post("/api/cart/items")
      .send({ productName: "T-shirt", quantity: 2, userType: "COMMON" });

    await agent
      .post("/api/cart/items")
      .send({ productName: "T-shirt", quantity: 1, userType: "COMMON" });

    const res = await agent
      .get("/api/cart/total")
      .query({ userType: "COMMON" });

    const promotionPrice = 35.99 * 2; // Assuming promotion price for T-shirt get 3 for 2 promo
    assert.ok(res.body.total === promotionPrice);
  });

  test("removes item and updates cart total", async () => {
    // Add product
    await agent
      .post("/api/cart/items")
      .send({ productName: "T-shirt", quantity: 2, userType: "COMMON" })
      .expect(200);

    // Get total after add
    const before = await agent
      .get("/api/cart/total")
      .query({ userType: "COMMON" })
      .expect(200);

    const totalBefore = before.body.total;
    assert.ok(totalBefore > 0, "Total before should be greater than 0");

    // Remove one item
    await agent
      .delete("/api/cart/items")
      .send({ productName: "T-shirt", userType: "COMMON" })
      .expect(200);

    // Get total after remove
    const after = await agent
      .get("/api/cart/total")
      .query({ userType: "COMMON" })
      .expect(200);

    const totalAfter = after.body.total;
    assert.ok(
      totalAfter < totalBefore,
      "Total should decrease after removing item"
    );
  });
});
