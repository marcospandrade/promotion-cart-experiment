export class Money {
  private readonly value: number;

  constructor(amount: number) {
    if (Number.isNaN(amount)) {
      throw new Error("Invalid monetary value");
    }
    this.value = parseFloat(amount.toFixed(2));
  }

  static from(amount: number): Money {
    return new Money(amount);
  }

  add(other: Money): Money {
    return new Money(this.value + other.value);
  }

  subtract(other: Money): Money {
    return new Money(this.value - other.value);
  }

  multiply(multiplier: number): Money {
    return new Money(this.value * multiplier);
  }

  divide(divisor: number): Money {
    if (divisor === 0) throw new Error("Cannot divide by zero");
    return new Money(this.value / divisor);
  }

  equals(other: Money): boolean {
    return this.value === other.value;
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(this.value);
  }
}
