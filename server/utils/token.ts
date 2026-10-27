import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'news_credibility_jwt_secret_token_key_academic_2026';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
