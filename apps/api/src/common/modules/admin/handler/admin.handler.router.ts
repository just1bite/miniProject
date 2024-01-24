import prisma from '@/prisma';
import { Request, Response } from 'express';


export const getEvent = async (req: Request, res: Response) => {
  try {
    const userEvent = await prisma.event.findMany();

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: userEvent,
    });
  } catch (error: any) {
    console.log(
      '@@@ getArticles of admin role error :',
      error.message || error,
    );
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};
