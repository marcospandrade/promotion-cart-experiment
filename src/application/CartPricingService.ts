import { Cart } from "@modules/cart/models/Cart";
import { PromotionEngine } from "@modules/promotion/PromotionEngine";
import { Get3For2Promotion } from "@modules/promotion/Get3For2Promotion";
import { VIPDiscountPromotion } from "@modules/promotion/VipDiscountPromotion";
import { ProductRepository } from "@modules/product/ProductRepository";

export class CartPricingService {
  private readonly engine: PromotionEngine;

  public constructor(private readonly productRepository: ProductRepository) {
    this.engine = new PromotionEngine([
      new Get3For2Promotion(),
      new VIPDiscountPromotion(),
    ]);
  }

  async addToCart(
    cart: Cart,
    productName: string,
    quantity: number = 1
  ): Promise<void> {
    const product = await this.productRepository.findByName(productName);
    if (!product) {
      throw new Error(`Product '${productName}' not found`);
    }

    for (let i = 0; i < quantity; i++) {
      cart.addProduct(product);
    }
  }

  async removeFromCart(cart: Cart, productName: string): Promise<void> {
    const product = await this.productRepository.findByName(productName);
    if (!product) throw new Error(`Product '${productName}' not found`);
    cart.removeProduct(product);
  }

  calculate(cart: Cart): {
    total: number;
    appliedPromotion: string;
  } {
    const result = this.engine.applyBest(cart);
    return {
      total: result.total,
      appliedPromotion: result.appliedPromotion,
    };
  }
}
