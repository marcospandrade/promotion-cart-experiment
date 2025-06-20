import express, { Router, Request, Response } from "express";
import { CartPricingService } from "@application/CartPricingService";
import { CartRepository } from "@modules/cart/CartRepository";
import {
  AddItemSchema,
  RemoveItemSchema,
} from "./schemas/CartControllerSchemas";
import { UserType } from "@modules/cart/models/Cart";

export class CartController {
  public readonly router: Router;

  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartPricingService: CartPricingService
  ) {
    this.router = Router();

    this.router.post("/cart/items", (req, res) => {
      this.addItem(req, res);
    });
    this.router.get("/cart/total", (req, res) => {
      this.getTotal(req, res);
    });
    this.router.get("/cart/list", (req, res) => {
      this.getCartItems(req, res);
    });
    this.router.post("/cart/clear", (req, res) => {
      this.clearCart(req, res);
    });
    this.router.delete("/cart/remove-item", (req, res) => {
      this.removeItem(req, res);
    });
  }

  private addItem = async (req: Request, res: Response) => {
    const result = AddItemSchema.safeParse({ ...req.body });
    const sessionId = req.sessionId;

    if (!result.success || !sessionId) {
      return res.status(422).json({ error: "Invalid payload" });
    }

    const { productName, quantity, userType } = result.data;

    try {
      const cart = await this.cartRepository.findOrCreateBySession(
        sessionId,
        userType as UserType
      );
      for (let i = 0; i < quantity; i++) {
        await this.cartPricingService.addToCart(cart, productName);
      }

      await this.cartRepository.save(cart);
      return res
        .status(200)
        .json({ message: `${quantity}x ${productName} added.` });
    } catch (err) {
      return res.status(404).json({ error: (err as Error).message });
    }
  };

  private removeItem = async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    const result = RemoveItemSchema.safeParse(req.body);

    if (!sessionId || !result.success) {
      return res.status(422).json({ error: "Invalid input" });
    }

    const { productName } = result.data;

    try {
      const cart = await this.cartRepository.findBySession(sessionId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const productExists = cart
        .getItems()
        .some((item) => item.getProduct().getName() === productName);

      if (!productExists) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      await this.cartPricingService.removeFromCart(cart, productName);
      await this.cartRepository.save(cart);

      return res.status(200).json({ message: `${productName} removed.` });
    } catch (err) {
      return res.status(404).json({ error: (err as Error).message });
    }
  };

  private getTotal = async (req: Request, res: Response) => {
    const sessionId = req.sessionId;

    if (!sessionId) {
      return res.status(422).json({ error: "Invalid input" });
    }

    const cart = await this.cartRepository.findBySession(sessionId.toString());

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const total = this.cartPricingService.calculate(cart);
    return res.status(200).json(total);
  };

  private getCartItems = async (req: Request, res: Response) => {
    const sessionId = req.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId required" });
    }

    const items = await this.cartRepository.listCartItems(sessionId.toString());
    return res.status(200).json(items);
  };

  private clearCart = async (req: Request, res: Response) => {
    const sessionId = req.sessionId;

    if (!sessionId) {
      return res.status(422).json({ error: "Invalid input" });
    }

    await this.cartRepository.clear(sessionId);

    return res.status(200).json({ message: "Cart cleared." });
  };
}
