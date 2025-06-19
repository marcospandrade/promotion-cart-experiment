import { Cart } from "@modules/cart/models/Cart";

export interface Promotion {
  getName(): string;
  apply(cart: Cart): PromotionResult;
}

export interface PromotionResult {
  total: number;
  appliedPromotion: string;
}
