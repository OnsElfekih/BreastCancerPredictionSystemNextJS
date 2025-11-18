import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
  nom: string;
  prenom: string;
}

export function verifyToken(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET non défini dans .env");

  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}
