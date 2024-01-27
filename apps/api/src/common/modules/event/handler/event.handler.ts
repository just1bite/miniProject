import prisma from '@/prisma';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { boolean, date, number, object, string } from 'yup';
import { verifyToken } from '@/common/helper/jwt.helper';
import { Prisma } from '@prisma/client';

export interface eventPayload {
  title: string;
  eventDescription: string;
  price: number;
  eventDate: Date;
  eventLocation: string;
  seatCount: number;
  userId: number;
  isFree: boolean;
  // ticketName: string;
}

export interface patchEventPayload {
  title?: string;
  eventDescription?: string;
  price?: number;
  eventDate?: Date;
  eventLocation?: string;
  seatCount?: number;
  tiketType?: string;
}

export interface PromotionCreateInput {
  eventId: number;
  discountVoucher?: string;
  maxUsage?: number;
  referralDiscount?: number;
  startDate?: Date;
  endDate?: Date;
}

export const eventPayload = object({
  body: object({
    title: string()
      .min(6, 'minimun lenght of title is 6')
      .max(32, 'maximun lenght of title is 32')
      .required('event title is required'),
    eventDescription: string()
      .min(16, 'minimun lenght of description is 16')
      .max(128, 'maximun length of description is 128')
      .required('description is required'),
    price: number().required('price is required'),
    eventDate: date().required('date is require'),
    eventLocation: string().required('location is require'),
    seatCount: number().required('available seat is require'),
    isFree: boolean().required('isFree is required'),
  }),
});

export const createEvent = async (req: Request, res: Response) => {
  try {
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
    const {
      title,
      eventDescription,
      price,
      eventDate,
      eventLocation,
      seatCount,
      isFree, // ticketTypes, //ticketTier
    }: eventPayload = req.body;
    if (
      !title ||
      !eventDescription ||
      !price ||
      !eventDate ||
      !eventLocation ||
      !seatCount
    ) {
      res.status(400).json({
        code: 400,
        message: 'Please enter the required fields.',
      });
    }

    const createEvent = await prisma.event.create({
      data: {
        title,
        eventDescription,
        price: isFree ? 0 : price,
        eventDate,
        eventLocation,
        seatCount,
        userId: userId,
      },
    });

    // Membuat promosi jika diperlukan
    const { createPromotionIfNeeded, discountVoucher, startDate, endDate } =
      req.body;
    if (createPromotionIfNeeded) {
      await prisma.promotion.createMany({
        data: [
          await createPromotion({
            eventId: createEvent.id,
            discountVoucher,
            startDate,
            endDate,
          }),
        ],
      });
    }
    return res.status(200).json({
      code: 200,
      message: 'Event Created Successfully',
    });
  } catch (error) {
    console.log(error, createEvent);
  }
};

export const createTicketType = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const token: string = req.cookies['api-token'];
    const { ticketName, discount } = req.body;

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: 'Token not found',
      });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken.isValid) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid token',
      });
    }

    const { id } = verifiedToken.data;

    const userWithId = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userWithId) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid user Id',
      });
    }

    if (!eventId || isNaN(parseInt(eventId))) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid eventId. Please provide a valid integer.',
      });
    }

    const eventTicketId = parseInt(eventId);
    const eventWithId = await prisma.event.findUnique({
      where: {
        id: eventTicketId,
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        message: `Event with id ${eventTicketId} not found`,
      });
    }

    const postTicketType = await prisma.ticketType.create({
      data: {
        ticketName,
        discount,
        eventId: eventWithId.id,
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Ticket tier successfully created',
      data: postTicketType,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const getEvent = async (req: any, res: Response) => {
  try {
    const { id } = req;

    const getEvent = await prisma.event.findMany({
      where: {
        id,
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: getEvent,
    });
  } catch (error: any) {
    console.log('@@@ getEvent error :', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid ID params',
      });
    }

    const userEvent = await prisma.event.findFirst({
      where: {
        id: parsedId,
        userId: parsedId,
      },
      include: {
        promotions: true,
      },
    });

    if (!userEvent) {
      return res.status(404).json({
        code: 404,
        message: `Event with id ${parsedId} not found`,
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: userEvent,
    });
  } catch (error: any) {
    console.log('@@@ getEvent error :', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const patchEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      eventDescription,
      price,
      eventDate,
      eventLocation,
      seatCount,
      ticketType,
    } = req.body;

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid ID params',
      });
    }

    const userEvent = await prisma.event.findFirst({
      where: {
        id: parsedId,
        userId: parsedId,
      },
    });

    if (!userEvent) {
      return res.status(404).json({
        code: 404,
        message: `Event with id ${parsedId} not found`,
      });
    }

    const patchEventPayload = {
      title,
      eventDescription,
      price,
      eventDate,
      eventLocation,
      seatCount,
      ticketType,
    };

    const patchedEvent = await prisma.event.update({
      where: {
        id: parsedId,
      },
      data: patchEventPayload,
    });

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: patchedEvent,
    });
  } catch (error: any) {
    console.log('@@@ patchEventById error:', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const deleteEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid ID params',
      });
    }

    const userEvent = await prisma.event.findFirst({
      where: {
        id: parsedId,
        // Add any additional conditions if needed
      },
    });

    if (!userEvent) {
      return res.status(404).json({
        code: 404,
        message: `Event with id ${parsedId} not found`,
      });
    }

    // Perform additional authorization checks if necessary

    await prisma.event.delete({
      where: {
        id: parsedId,
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Success',
    });
  } catch (error: any) {
    console.log('@@@ deleteEventById error:', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const createPromotion = async (
  data: PromotionCreateInput,
): Promise<Prisma.PromotionCreateManyInput> => {
  return {
    eventId: data.eventId,
    discountVoucher: data.discountVoucher || '',
    maxUsage: data.maxUsage,
    referralDiscount: data.referralDiscount,
    startDate: data.startDate,
    endDate: data.endDate,
  };
};

export const redeemPoints = async (req: Request, res: Response) => {
  try {
    const token: string = req.cookies['api-token'];
    const { pointsToRedeem } = req.body;
    const { eventid } = req.params;
    // Validasi token
    const verifiedToken = verifyToken(token);
    if (!verifiedToken.isValid) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid token',
      });
    }
    const userId = verifiedToken.data.id;
    const id = parseInt(eventid);

    // Dapatkan informasi pengguna
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'User not found',
      });
    }

    // Dapatkan informasi acara
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    if (!event) {
      return res.status(404).json({
        code: 404,
        message: 'Event not found',
      });
    }

    // Hitung harga akhir setelah penukaran poin
    const finalPrice = Math.max(0, event.price - pointsToRedeem);

    // Lakukan proses penukaran poin

    return res.status(200).json({
      code: 200,
      message: 'Points redeemed successfully',
      data: {
        finalPrice,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const applyReferralDiscount = async (req: Request, res: Response) => {
  try {
    const userToken = req.cookies['api-token'];
    const { referralNumber } = req.body;
    const { eventid } = req.params;

    // Validasi token
    const verifiedToken = verifyToken(userToken);
    if (!verifiedToken.isValid) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid token',
      });
    }
    const userId = verifiedToken.data.id;
    const id = parseInt(eventid);

    // Dapatkan informasi pengguna
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'User not found',
      });
    }

    // Dapatkan informasi acara

    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    if (!event) {
      return res.status(404).json({
        code: 404,
        message: 'Event not found',
      });
    }

    // Cek apakah referralNumber valid
    const isReferralNumberValid = async (
      referralNumber: string,
    ): Promise<boolean> => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            referral_number: referralNumber,
          },
        });
        // If the user with the provided referral number exists, it's considered valid
        return !!existingUser;
      } catch (error) {
        console.error('Error checking referral number validity:', error);
        return false;
      }
    };

    if (!referralNumber) {
      return res.status(404).json({
        code: 404,
        message: `Invalid Referral Number`,
      });
    }

    //check referral number validity
    // const isReferralNumberInvalid = async (
    //   referralNumber: string,
    // ): Promise<boolean> => {
    //   return !(await isReferralNumberValid(referralNumber));
    // };

    // Check referral number is valid
    const isReferralValid = await isReferralNumberValid(referralNumber);

    const referralDiscountPercentage = 10; // 10% referral discount
    // Hitung harga akhir setelah penerapan diskon referral
    const finalPrice =
      event.price - (event.price * referralDiscountPercentage) / 100;

    return res.status(200).json({
      code: 200,
      message: 'Referral discount applied successfully',
      data: {
        finalPrice,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};
