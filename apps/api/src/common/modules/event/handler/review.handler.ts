import { Request, Response } from 'express';
import prisma from '@/prisma';
import { verifyToken } from '@/common/helper/jwt.helper';

export const addRatingAndReview = async (req: Request, res: Response) => {
  try {
    const { eventid } = req.params;
    const { rating, review } = req.body;
    const userToken = req.cookies['api-token'];

    // Validasi token dan mendapatkan userId dari token
    const verifiedToken = verifyToken(userToken);
    if (!verifiedToken.isValid) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid token',
      });
    }
    const userId = verifiedToken.data.id;
    const id = parseInt(eventid);

    // Temukan event berdasarkan eventId (pastikan eventId adalah tipe number)
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    if (!event) {
      return res.status(404).json({
        code: 404,
        message: `Event with id ${eventid} not found`,
      });
    }

    // Pastikan userId belum memberikan rating untuk event ini
    const existingRating = await prisma.rating.findFirst({
      where: {
        id: userId,
        eventId: id,
      },
    });

    if (existingRating) {
      return res.status(400).json({
        code: 400,
        message: 'You have already rated this event',
      });
    }


    // Tambahkan rating dan review ke database
    const newRating = await prisma.rating.create({
      data: {
        id: verifiedToken.data.id,
        rating,
        review,
        eventId: id,
        reviewBy: verifiedToken.data.username,
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Rating and review added successfully',
      data: newRating,
    });
  } catch (error: any) {
    console.error('@@@ addRatingAndReview error:', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after operation
  }
};
