import { Cart } from "@modules/cart/models/Cart";

export interface CartRepository {
  findById(id: string): Promise<Cart | null>;
  findAll(): Promise<Cart[]>;
}
