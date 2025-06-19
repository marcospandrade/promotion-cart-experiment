import { Cart } from "@generated/prisma";
import { prisma } from "../client";
import { CartRepository } from "@modules/cart/CartRepository";
import { Cart as DomainCart } from "@modules/cart/models/Cart";

export class PrismaCartRepository implements CartRepository {
  async findById(id: string): Promise<DomainCart | null> {
    const cart = await prisma.cart.findUnique({ where: { id } });
    return cart ? new DomainCart(cart.userType) : null;
  }

  async findAll(): Promise<DomainCart[]> {
    const carts = await prisma.cart.findMany();
    return carts.map((c: Cart) => new DomainCart(c.userType));
  }
}
