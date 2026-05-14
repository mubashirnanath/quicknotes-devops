import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types';

export const signToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as JwtPayload;
};
