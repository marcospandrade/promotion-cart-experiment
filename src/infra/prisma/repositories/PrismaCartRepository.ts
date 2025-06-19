import { CartRepository } from "@modules/cart/CartRepository";
import { Cart, UserType } from "@modules/cart/models/Cart";
import { CartItem } from "@modules/cart/models/CartItem";
import { Product } from "@modules/product/models/Product";
import { prisma } from "../client";

export class PrismaCartRepository implements CartRepository {
  async findBySession(sessionId: string): Promise<Cart | null> {
    const data = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true } } },
    });

    return data ? this.toDomain(data) : null;
  }

  async listCartItems(sessionId: string): Promise<Cart[]> {
    const data = await prisma.cart.findMany({
      where: { sessionId },
      include: { items: { include: { product: true } } },
    });

    return data.map((cart) => this.toDomain(cart));
  }

  async findById(id: number): Promise<Cart | null> {
    const data = await prisma.cart.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    return data ? this.toDomain(data) : null;
  }

  async findOrCreateBySession(
    sessionId: string,
    userType: UserType
  ): Promise<Cart> {
    if (userType !== UserType.COMMON && userType !== UserType.VIP) {
      throw new Error("Invalid user type");
    }

    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionId,
          userType,
        },
        include: { items: { include: { product: true } } },
      });
    }

    return this.toDomain(cart);
  }

  async save(cart: Cart): Promise<void> {
    const existing = await prisma.cart.findUnique({
      where: { sessionId: cart.getSessionId() },
    });

    if (!existing) throw new Error("Cart not found");

    await prisma.cartItem.deleteMany({
      where: { cartId: existing.id },
    });

    const items = cart.getItems().map((item) => ({
      cartId: existing.id,
      productId: item.getProductId(),
      quantity: item.getQuantity(),
    }));

    await prisma.cart.update({
      where: { id: existing.id },
      data: {
        userType: cart.getUserType(),
        items: {
          createMany: {
            data: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              id: item.cartId,
            })),
          },
        },
      },
    });
  }

  async clear(sessionId: string): Promise<void> {
    await prisma.cartItem.deleteMany({ where: { cart: { sessionId } } });
  }

  private toDomain(data: any): Cart {
    const cart = new Cart(data.userType, data.sessionId);
    for (const item of data.items) {
      const product = new Product(
        item.product.name,
        item.product.price,
        item.product.id
      );
      for (let i = 0; i < item.quantity; i++) {
        cart.addProduct(product);
      }
    }
    return cart;
  }
}
