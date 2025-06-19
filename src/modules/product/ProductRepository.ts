import { Product } from "./models/Product";

export interface ProductRepository {
  findByName(name: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}
