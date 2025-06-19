import { CartRepository } from "@modules/cart/CartRepository";
import { ProductRepository } from "../modules/product/ProductRepository";
import { PrismaProductRepository } from "./prisma/repositories/PrismaProductRepository";
import { PrismaCartRepository } from "./prisma/repositories/PrismaCartRepository";

export class RepositoryFactory {
  static getProductRepository(): ProductRepository {
    return new PrismaProductRepository();
  }

  static getCartRepository(): CartRepository {
    return new PrismaCartRepository();
  }
}
