import { Request, Response } from "express";
import {
  signUpService,
  signInService,
  refreshTokenService,
  signOutService,
} from "../services/auth.service.js";

export async function signUpController(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const result = await signUpService({ username, password });
    res.status(201).json(result);

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function signInController(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const result = await signInService({ username, password });
    res.status(200).json(result);

  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function refreshTokenController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refresh token" });
    }

    const tokens = await refreshTokenService(refreshToken);
    res.json(tokens);

  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function signOutController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refresh token" });
    }

    await signOutService(refreshToken);
    res.json({ message: "Signed out successfully" });

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
