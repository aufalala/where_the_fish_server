import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";

import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/env.config.js";

export async function signUpService({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });

  return await signInService({ username, password });
}

export async function signInService({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid username or password");

  const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  await Token.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
    },
  };
}

export async function refreshTokenService(oldRefreshToken: string) {
  const stored = await Token.findOne({ token: oldRefreshToken });
  if (!stored) throw new Error("Invalid or expired refresh token");

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET) as {
      id: string;
    };
  } catch {
    throw new Error("Invalid refresh token");
  }

  await Token.deleteOne({ token: oldRefreshToken });

  const accessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  await Token.create({
    userId: decoded.id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function signOutService(refreshToken: string) {
  if (!refreshToken) return;

  await Token.findOneAndDelete({ token: refreshToken });
}
