import { ProductRepository } from "@modules/product/ProductRepository";
import { Product as DomainProduct } from "@modules/product/models/Product";
import { prisma } from "../client";
import { Product } from "@prisma/client";

export class PrismaProductRepository implements ProductRepository {
  async findByName(name: string): Promise<DomainProduct | null> {
    const product = await prisma.product.findUnique({ where: { name } });
    return product
      ? new DomainProduct(product.name, product.price, product.id)
      : null;
  }

  async findAll(): Promise<DomainProduct[]> {
    const products = await prisma.product.findMany();
    return products.map(
      (p: Product) => new DomainProduct(p.name, p.price, p.id)
    );
  }
}
