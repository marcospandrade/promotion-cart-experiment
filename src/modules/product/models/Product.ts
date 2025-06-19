export class Product {
  public constructor(
    private readonly name: string,
    private readonly price: number,
    private readonly id?: number
  ) {
    if (price <= 0) {
      throw new Error("Product price must be greater than 0");
    }

    if (!name || name.trim() === "") {
      throw new Error("Product name cannot be empty");
    }
  }

  getId(): number | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  equals(other: Product): boolean {
    return this.name === other.name && this.price === other.price;
  }
}
