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
  isFree?: boolean;
  createPromotionIfNeeded?: boolean;
  discountVoucher: string;
}

export interface PromotionCreateInput {
  eventId: number;
  discountVoucher?: string;
  maxUsage?: number;
  referralDiscount?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface PromotionVoucherDiscount {
  createPromotionIfNeeded: boolean;
  discountVoucher: string;
  maxUsage: number;
}

// export interface TransactionPayload {
//   pointsToRedeem: number;
//   countSeat: number;
// }

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
      isFree,
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
    const {
      createPromotionIfNeeded,
      discountVoucher,
      maxUsage,
    }: PromotionVoucherDiscount = req.body;
    if (createPromotionIfNeeded) {
      await prisma.promotion.createMany({
        data: [
          await createPromotion({
            eventId: createEvent.id,
            discountVoucher,
            maxUsage,
            startDate: eventDate,
            // endDate,
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
      isFree,
    }: patchEventPayload = req.body;

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
      isFree,
    };

    const patchedEvent = await prisma.event.update({
      where: {
        id: parsedId,
      },
      data: patchEventPayload,
    });

    return res.status(200).json({
      code: 200,
      message: 'Success updated',
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

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userToken = req.cookies['api-token'];
    const { pointsToRedeem, countSeat, discountVoucher } = req.body; //: TransactionPayload
    const { eventid } = req.params;

    // Validate token
    const verifiedToken = verifyToken(userToken);
    if (!verifiedToken.isValid) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid token',
      });
    }

    const id = parseInt(verifiedToken.data.id);
    const eventId = parseInt(eventid);

    // Get event details
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({
        code: 404,
        message: 'Event not found',
      });
    }

    // Get user point
    const userPoint = await prisma.userpoint.findFirst({
      where: {
        userId: id,
      },
      orderBy: {
        amount: 'desc',
      },
    });

    // Calculate the discounted price after using points
    const discountedPrice = event.price - pointsToRedeem;
    const updatedPricePoint = Math.max(discountedPrice, 0);
    console.log('updatedPricePoint', updatedPricePoint);

    // Get Promotion
    const promotions = await prisma.promotion.findMany({
      where: {
        eventId: eventId,
      },
    });

    const isVoucherValid = promotions.some((promotion) => {
      return promotion.discountVoucher === discountVoucher;
    });

    let updatedPromotion = 0;

    if (isVoucherValid) {
      const usePromotionPrice = (event.price * 10) / 100;
      updatedPromotion = Math.max(usePromotionPrice, 0);
    }
    console.log('updatedPromotion', updatedPromotion);
    const totalMaxUsage = promotions.reduce(
      (acc, promo) => acc + promo.maxUsage,
      0,
    );

    // Now, you can check if the total maxUsage is exceeded
    if (totalMaxUsage < 0) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid voucher code or max usage exceeded',
      });
    }

    // Calculate the discounted price after using promotion
    const usePromotionPrice = (event.price * 10) / 100;
    updatedPromotion = Math.max(usePromotionPrice, 0);
    console.log('updatePromotion', updatedPromotion);

    // Update user's pointAmount after redeeming points
    const redeemPoint = Math.max(
      userPoint?.amount !== undefined ? userPoint.amount - pointsToRedeem : 0,
      0,
    );

    if (redeemPoint) {
      await prisma.userpoint.findFirst({
        where: {
          userId: id,
        },
      });
      await prisma.userpoint.updateMany({
        data: {
          amount: redeemPoint,
        },
      });
    }
    console.log('redeemPoint', redeemPoint);

    //get Voucher
    let updatedVoucher = 0;
    const voucher = await prisma.uservoucher.findMany({
      where: {
        userId: id,
      },
    });

    if (voucher.length > 0) {
      updatedVoucher = (event.price * 10) / 100;
    }
    console.log('updatedVoucher', updatedVoucher);

    // Check if updatedVoucher is NaN, if yes, set it to 0
    const validUpdatedVoucher = isNaN(updatedVoucher) ? 0 : updatedVoucher;

    // Check if updatedPromotion is NaN, if yes, set it to 0
    const validUpdatedPromotion = isNaN(updatedPromotion)
      ? 0
      : updatedPromotion;

    // Check if pointsToRedeem is NaN, if yes, set it to 0
    const validPointsToRedeem = isNaN(pointsToRedeem) ? 0 : pointsToRedeem;

    // Calculate the final price with non-NaN values
    const finalPrice =
      event.price -
      (validUpdatedVoucher + validUpdatedPromotion + validPointsToRedeem);

    console.log('finalprice', finalPrice);

    // Set a default value for countSeat if not provided
    const updatedCountSeat = countSeat || 1;

    // Calculate the updated seatCount, ensuring it doesn't go below zero
    const updatedEventSeat = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        seatCount: Math.max(0, event.seatCount - updatedCountSeat),
      },
    });

    // Check if seatCount is less than 0 after the update
    if (updatedEventSeat.seatCount <= 0) {
      return res.status(400).json({
        code: 400,
        message: 'Max seat count available not found',
      });
    }

    // Continue with the rest of your code...

    // Create transaction
    const createdTransaction = await prisma.transaction.create({
      data: {
        eventId: eventId,
        eventName: event.title,
        dateEvent: event.eventDate,
        finalPrice: finalPrice,
        countSeat: updatedEventSeat.seatCount,
        purchasedBy: verifiedToken.data.username,
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Transaction successful',
      transaction: createdTransaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: 'Transaction failed',
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
    startDate: data.startDate,
    endDate: data.endDate,
  };
};
