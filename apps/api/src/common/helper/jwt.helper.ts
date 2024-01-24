import { JWT_SECRET } from '@/config';
import { sign, verify } from 'jsonwebtoken';

export const generateToken = (user: any) => {
  const { id, username, email, role } = user;
  return sign(
    {
      id,
      username,
      email,
      role,
    },
    JWT_SECRET,
  );
};

export const verifyToken = (
  token: string,
): { isValid: boolean; data?: any } => {
  try {
    const verifiedToken = verify(token, JWT_SECRET);
    return {
      isValid: true,
      data: verifiedToken,
    };
  } catch {
    return {
      isValid: false,
    };
  }
};
