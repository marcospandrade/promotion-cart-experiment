import { Request, Response, NextFunction } from "express";
import { logger } from "@shared/Logger";
import { randomUUID } from "node:crypto";

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reqId = req.headers["x-request-id"] || randomUUID();
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      requestId: reqId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}
