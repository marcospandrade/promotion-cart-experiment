import { CartItem } from "@modules/cart/models/CartItem";
import { Product } from "@modules/product/models/Product";

export enum UserType {
  COMMON = "COMMON",
  VIP = "VIP",
}

export class Cart {
  private items: CartItem[] = [];

  constructor(private readonly userType: UserType) {}

  getUserType(): UserType {
    return this.userType;
  }

  getItems(): CartItem[] {
    return this.items;
  }

  addProduct(product: Product): void {
    const existing = this.items.find((item) =>
      item.getProduct().equals(product)
    );

    if (existing) {
      existing.incrementQuantity();
    } else {
      this.items.push(new CartItem(product, 1));
    }
  }

  removeProduct(product: Product): void {
    const index = this.items.findIndex((item) =>
      item.getProduct().equals(product)
    );
    if (index !== -1) {
      const item = this.items[index];
      if (item.getQuantity() > 1) {
        item.decrementQuantity();
      } else {
        this.items.splice(index, 1);
      }
    }
  }

  clear(): void {
    this.items = [];
  }

  totalItems(): number {
    return this.items.reduce((acc, item) => acc + item.getQuantity(), 0);
  }
}
