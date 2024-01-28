import { Request, Response } from 'express';
import { object, string } from 'yup';
import dayjs from 'dayjs';
import { compare, hash } from '@/common/helper/bcrypt.helper';
import { generateToken } from '@/common/helper/jwt.helper';
import { generateReferral } from '@/common/helper/referral.helper';
import prisma from '@/prisma';

export const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({
        message: `user with email ${email} not found`,
      });
    }
    const isValidUserPassword = compare(password, user.password);

    if (!isValidUserPassword) {
      return res.status(404).json({
        message: `invalid user or password`,
      });
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
    res.status(200).cookie('api-token', token, {
      secure: false,
      httpOnly: true,
      expires: dayjs().add(7, 'day').toDate(),
    });

    console.log(req.cookies);

    return res.status(200).json({
      code: 200,
      message: 'success',
      data: user,
    });
  } catch (error: any) {
    console.log(error);
  }
};

export interface signupPayload {
  email: string;
  password: string;
  username: string;
  referralCode?: string;
  role?: string;
}

export const signUpSchema = object({
  body: object({
    username: string()
      .min(6, 'minimun lenght of username is 6')
      .max(15, 'maximun lenght of username is 15')
      .required('username is required'),
    email: string().email().required('email is required'),
    password: string()
      .min(6, 'minimun lenght of password is 6')
      .max(15, 'maximun lenght of password is 15')
      .required('username is required'),
  }),
});
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username, referralCode, role }: signupPayload =
      req.body;

    const hashedPassword = hash(password);
    const userReferral = generateReferral(username);

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithEmail) {
      return res.status(400).json({
        message: 'Email already exists.',
      });
    }

    const userWithUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userWithUsername) {
      return res.status(400).json({
        message: 'Username already exists.',
      });
    }

    let transaction;

    if (!referralCode) {
      // If no referral code is provided, create a user without rewards
      transaction = await prisma.$transaction(async (prisma: any) => {
        const createUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username,
            referral_number: userReferral,
            role,
          },
        });
        return {
          createUser,
        };
      });
    } else {
      // If a referral code is provided, create a user and reward the referrer
      const authorReferral = await prisma.user.findUnique({
        where: {
          referral_number: referralCode,
        },
      });

      if (!authorReferral) {
        return res.status(400).json({
          message: 'Invalid Referral code.',
        });
      }

      transaction = await prisma.$transaction(async (prisma: any) => {
        const createUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username,
            referral_number: userReferral,
            role,
          },
        });

        // Create a point for the referrer
        const point = await prisma.userpoint.create({
          data: {
            userId: authorReferral?.id,
            username: authorReferral?.username,
            expiredDate: dayjs().add(90, 'day').toDate(),
            amount: 0,
          },
        });

        const existingPoints = await prisma.userpoint.count({
          where: {
            userId: authorReferral?.id,
          },
        });

        // Update the ownerReferral points by adding 10,000 points
        const totalPointsForReferrer = existingPoints * 10000;
        const updatedAuthor = await prisma.userpoint.update({
          where: {
            id: point.id,
          },
          data: {
            amount: {
              set: totalPointsForReferrer,
            },
          },
        });

        // Create a voucher for the user use referral
        const voucher = await prisma.uservoucher.create({
          data: {
            userId: createUser.id,
            username: createUser.username,
            expiredDate: dayjs().add(90, 'day').toDate(),
          },
        });

        // Update the user voucher 10%
        const updatedVoucher = await prisma.uservoucher.update({
          where: {
            id: voucher.id,
          },
          data: {
            voucherAmount: {
              set: 0.1,
            },
          },
        });

        return {
          createUser,
        };
      });
    }

    return res.status(200).json({
      message: 'success',
      data: transaction.createUser,
    });
  } catch (error: any) {
    console.log('@@@ signupUser error:', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie('api-token');
    return res.status(200).json({
      code: 200,
      message: 'silahkan kembali',
    });
  } catch (error) {
    console.log(error);
  }
};
