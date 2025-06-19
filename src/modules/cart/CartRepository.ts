import { Cart, UserType } from "@modules/cart/models/Cart";

export interface CartRepository {
  findById(id: number): Promise<Cart | null>;
  findOrCreateBySession(sessionId: string, userType: UserType): Promise<Cart>;
  save(cart: Cart): Promise<void>;
  listCartItems(sessionId: string): Promise<Cart[]>;
  clear(sessionId: string): Promise<void>;
}
