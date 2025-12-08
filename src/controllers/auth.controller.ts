import { Request, Response } from "express";
import { signUpService, signInService, refreshTokenService, signOutService } from "../services/auth.service.js";

export async function signUpController(req: Request, res: Response) {
  try {
    const result = await signUpService(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function signInController(req: Request, res: Response) {
  try {
    const result = await signInService(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function refreshTokenController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ error: "Missing refresh token" });
    
    const tokens = await refreshTokenService(refreshToken);
    res.json(tokens);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function signOutController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken)
      return res.status(400).json({ error: "Missing refresh token" });

    await signOutService(refreshToken);
    res.json({ message: "Signed out" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}