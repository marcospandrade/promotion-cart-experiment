import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

declare module "express-serve-static-core" {
  interface Request {
    sessionId?: string;
  }
}

export function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = randomUUID().toString();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    });
  }

  // Attach to request so controllers can access it
  req["sessionId"] = sessionId;

  next();
}
