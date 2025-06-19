import express from "express";
import cookieParser from "cookie-parser";

import { CartPricingService } from "@application/CartPricingService";
import { CartController } from "controllers/CartController";
import { RepositoryFactory } from "infra/RepositoryFactory";
import { sessionMiddleware } from "middlewares/sessionMiddleware";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
const PORT = process.env.PORT || 3000;

const cartRepo = RepositoryFactory.getCartRepository();
const productRepo = RepositoryFactory.getProductRepository();
const cartService = new CartPricingService(productRepo);

const cartController = new CartController(cartRepo, cartService);
app.use("/api", cartController.router);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🛒 SmartCart API running at http://localhost:${PORT}`);
  });
}
export { app };
