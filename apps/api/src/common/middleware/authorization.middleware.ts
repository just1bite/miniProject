import prisma from '@/prisma';
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // login diambil dari cookie
    const cookie = req.cookies;
    if (!cookie) {
      return res.status(400).json({
        code: 400,
        message: 'Login required',
      });
    }
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

    const userToken = req.cookies['api-token'];
    const userId = getUserIdFromToken(userToken);

    if (!userId) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Login required.',
      });
    }

    // Mengambil data pengguna dari database menggunakan Prisma
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // jika ada user admin lalu ke next function
    const isAdmin = user?.role === 'admin';

    if (!isAdmin) {
      return res.status(403).send({
        code: 403,
        message: 'You are not allowed to access this endpoint',
      });
    }

    next();
  } catch (error) {
    console.error('Error in authorization middleware:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  } finally {
    await prisma.$disconnect(); // Pastikan untuk memutuskan koneksi Prisma setelah penggunaan
  }
};
