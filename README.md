# 🛒 SmartCart Promotional Pricing System

A modular, DDD-inspired shopping cart system built with Node.js, TypeScript, Express, Prisma, and Zod. This application calculates the best promotional price based on user type and product catalog, supporting persistent cart sessions via database.

---

## 📦 Features

- Add/remove items from a shopping cart
- Apply best applicable promotion automatically:
  - Common: "Get 3 for 2"
  - VIP: Either "Get 3 for 2" or "15% VIP discount"
- Persistent cart sessions via SQLite + Prisma
- Modular architecture: clean domain separation
- Full unit + integration test coverage
- Express API interface options
- Manual validation using Zod schemas
- CI integration
- Dockerized environment for easy deployment

---

## 📁 Project Structure

```
/src
  /application         # Orchestrates use cases
  /controllers         # Express controllers + validation schemas
  /domain (modules)    # DDD: Cart, Product, Promotion
  /infra               # Prisma implementation of repositories
  /middleware          # Session management
  /shared              # Value objects (e.g., Money)
  /test                # Integration + scenario tests
```

---

## 🧠 Architecture & DDD

### Entities & Value Objects
- `Cart` (aggregate root): holds `CartItem`s, enforces add/remove rules
- `Product`: value object with `name`, `price`, and optional `id`
- `Money`: value object to encapsulate monetary precision
- `CartItem`: value object holding quantity and product reference

### Domain Services
- `PromotionEngine`: selects the best strategy for VIP users
- `Get3For2Promotion` and `VIPDiscountPromotion`: encapsulate rules

### Repositories
- `ProductRepository`, `CartRepository`: contracts used by services
- Prisma-based implementations injected at runtime

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Prisma + DB
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Run the server
```bash
npm run dev
```
Visit: http://localhost:3000/api

---

## 🐳 Docker Support

### Prerequisites
- Docker installed and running
- `.env` file at the root with:
  ```env
  DATABASE_URL="file:./dev.db"
  ```

### Run with Makefile
```bash
make start   # builds and runs the container
```

### Makefile Commands
```Makefile
build:
	docker build -t app .

run:
	docker run -p 3000:3000 app

start: build run
```

---

## 🧪 Running Tests

```bash
npm test         # unit + integration
npm run coverage # coverage with c8
```

---

## 🔁 CI Pipeline (GitHub Actions)

This project includes a simple CI pipeline via `.github/workflows/ci.yml`. It does the following:

- Runs on every `push` or `pull_request` to the `main` branch
- Checks out the repo and installs dependencies
- Copies `.env.test` → `.env` and creates `tmp` folder for DB
- Runs Prisma client generation and migrations
- Executes all tests

To support SQLite-based tests in CI:
- Use a `.env.test` file with: `DATABASE_URL="file:./tmp/test.db"`
- CI will create the `./tmp` folder so Prisma can write to the database

---

## 📡 API Reference

### `POST /api/cart/items`
Add a product to the cart.
```json
{
  "productName": "Jeans",
  "quantity": 2,
  "userType": "VIP"
}
```

### `DELETE /api/cart/items`
Remove a product from the cart.
```json
{
	"productName": "Jeans"
}
```

### `GET /api/cart/total`
Returns total + applied promotion.
```json
{
  "total": 173.47,
  "appliedPromotion": "Get 3 for the Price of 2"
}
```

### `POST /api/cart/clear`
Clears the cart for the current session.

### Insomnia JSON
You can also check under docs folder, a JSON to easily import at Insomnia and be ready for running the endpoints.

---

## ✅ Validation
- Zod schemas validate all inputs at the controller layer
- Includes custom error messages and safeParse handling

---

## 📌 Assumptions & Trade-offs
- No `User` entity: only `UserType` (`VIP` or `COMMON`)
- One cart per session ID (cookie-based)
- `Product` modeled as a value object, upgraded to hold an `id`
- Promotion logic handled through Strategy pattern
- No frontend, CLI or HTTP-only (simple for testing)

---

## 🧩 Future Improvements
- Cart expiration policy
- Web frontend or CLI interface
- Advanced pricing engine (tiers, time-limited promos)
- Rate limiting, auth layer, and metrics
- Observability via logging and metrics (e.g., Prometheus)

---

## 🧑‍💻 Tech Stack
- Node.js + TypeScript
- Express
- Prisma + SQLite
- Zod
- Supertest + node:test + tsx
- DDD principles
- Pino logging
- Docker + Makefile commands

---

## 🧼 License
MIT