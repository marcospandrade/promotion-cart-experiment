import { Product } from "@modules/product/models/Product";

export class CartItem {
  private quantity: number;

  constructor(private readonly product: Product, initialQuantity: number = 1) {
    this.quantity = initialQuantity;
  }

  getProduct(): Product {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }

  incrementQuantity(): void {
    this.quantity += 1;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  getSubtotal(): number {
    return this.product.getPrice() * this.quantity;
  }
}
