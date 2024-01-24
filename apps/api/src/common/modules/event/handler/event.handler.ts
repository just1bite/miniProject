import prisma from '@/prisma';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { date, number, object, string } from 'yup';
import { verifyToken } from '@/common/helper/jwt.helper';

export interface eventPayload {
  title: string;
  eventDescription: string;
  price: number;
  eventDate: Date;
  eventLocation: string;
  seatCount: number;
  userUser_id: number;
}

export interface patchEventPayload {
  title?: string;
  eventDescription?: string;
  price?: number;
  eventDate?: Date;
  eventLocation?: string;
  seatCount?: number;
  ticketTier?: string;
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
    }: eventPayload  = req.body;
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
        price,
        eventDate,
        eventLocation,
        seatCount,
        userUser_id: userId,
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Event Created Successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

export const createTicketTier = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const token: string = req.cookies['api-token'];
    const { tierName, discount } = req.body;

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
        user_id: id,
      },
    });
    if (!userWithId) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid user Id',
      });
    }
    if (!eventId) {
      return res.status(401).json({
        code: 401,
        message: `Event id ${eventId} not found`,
      });
    }

    const eventWithId = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!eventWithId) {
      return res.status(401).json({
        code: 401,
        message: `Event id ${eventWithId} not found`,
      });
    }

    const postTicketTier = await prisma.ticketTier.create({
      data: {
        tierName,
        discount,
        eventId: eventWithId.id,
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Ticket tier successfully created',
      data: postTicketTier,
    });
  } catch (error) {
    console.log(error);
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
    console.log('@@@ getArticles error :', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { userUser_id } = req.params;
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid ID params',
      });
    }

    const userArticle = await prisma.event.findFirst({
      where: {
        id: parsedId,
        userUser_id: parsedId,
      },
    });

    if (!userArticle) {
      return res.status(404).json({
        code: 404,
        message: `Article with id ${parsedId} not found`,
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: userArticle,
    });
  } catch (error: any) {
    console.log('@@@ getArticles error :', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const patchEventById = async (req: Request, res: Response) => {
  try {
    const { userUser_id } = req.params;
    const { id } = req.params;
    const {
      title,
      eventDescription,
      price,
      eventDate,
      eventLocation,
      seatCount,
      ticketTier,
    } = req.body;

    const patchEventPayload = {
      title,
      eventDescription,
      price,
      eventDate,
      eventLocation,
      seatCount,
      ticketTier,
    };

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
        userUser_id: parsedId,
      },
    });

    if (!userEvent) {
      return res.status(404).json({
        code: 404,
        message: `Event with id ${parsedId} not found`,
      });
    }

    const patchedEvent = await prisma.event.update({
      where: {
        id: parsedId,
      },
      data: patchEventPayload,
    });

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: patchEventPayload,
    });
  } catch (error: any) {
    console.log('@@@ getArticles error :', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const deleteEventById = async (req: Request, res: Response) => {
  try {
    const { userUser_id } = req.params;
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
        userUser_id: parsedId,
      },
    });

    if (!userEvent) {
      return res.status(404).json({
        code: 404,
        message: `Article with id ${parsedId} not found`,
      });
    }

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
    console.log('@@@ getArticles error :', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};
