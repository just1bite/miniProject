import { Request, Response } from 'express';
import { object, string } from 'yup';
import dayjs from 'dayjs';
import prisma from '@/prisma';
import { compare, hash } from '@/common/helper/bcrypt.helper';
import { generateToken } from '@/common/helper/jwt.helper';
import { generateReferral } from '@/common/helper/referral.helper';

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
    const { email, password, username, referralCode }: signupPayload = req.body;

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
    if (!referralCode) {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          referral_number: userReferral,
        },
      });
      return res.status(200).json({
        code: 200,
        message: 'success',
        data: user,
      });
    }
    if (referralCode) {
      const authorReferral = await prisma.user.findUnique({
        where: {
          referral_number: referralCode,
        },
      });
      if (!authorReferral) {
        return res.status(400).json({
          message: 'invalid Referral code.',
        });
      }
      const transaction = await prisma.$transaction(async (prisma: any) => {
        const createUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username,
            referral_number: userReferral,
          },
        });
        const point = await prisma.point.create({
          data: {
            userId: authorReferral?.id,
            expiredDate: dayjs().add(90, 'day').toDate(),
          },
        });
        const voucher = await prisma.voucher.create({
          data: {
            userId: createUser.id,
            expiredDate: dayjs().add(90, 'day').toDate(),
          },
        });
        return {
          createUser,
        };
      });
      return res.status(200).json({
        message: 'success',
        data: transaction.createUser,
      });
    }
  } catch (error: any) {
    console.log('@@@ getBranchById error:', error.message || error);
    return res.status(500).json({
      code: 500,
      messagge: 'Internal Server Error',
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
