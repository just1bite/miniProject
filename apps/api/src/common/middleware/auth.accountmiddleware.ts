import prisma from '@/prisma';
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userToken = req.cookies['api-token'];
    const userId = getUserIdFromToken(userToken);

    if (!userId) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Login required.',
      });
    }
    const requestedUserId = parseInt(req.params.id, 10);

    if (userId !== requestedUserId) {
      return res.status(403).json({
        code: 403,
        message: 'Forbidden. You are not allowed to access this endpoint.',
      });
    }

    next();
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  } finally {
    await prisma.$disconnect();
  }
};
const getUserIdFromToken = (token: string): number | null => {
  try {
    const decodedToken = jwt.verify(token, 'secret') as {
      id: number;
    };

    return decodedToken.id;
  } catch (error) {
    return null;
  }
};
