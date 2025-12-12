import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../config/env.config.js"; 

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    req.user = decoded;

    next();
    
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
