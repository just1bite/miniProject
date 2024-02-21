import { Request, Response } from 'express';
import { object, string } from 'yup';
import dayjs from 'dayjs';
import { compare, hash } from '@/common/helper/bcrypt.helper';
import { generateToken } from '@/common/helper/jwt.helper';
import { generateReferral } from '@/common/helper/referral.helper';
import prisma from '@/prisma';
import jwt from 'jsonwebtoken';
// import Cookies from 'js-cookie';

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

    const existingToken = req.cookies['api-token'];
    if (existingToken) {
      return res.status(400).json({
        message: `you're already signed in.`,
      });
    }

    console.log(req.cookies);

    return res.status(200).json({
      code: 200,
      message: 'success',
      success: true,
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
      // jika gk ada referral digunakan langsung buat user
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
      // jika referral code dengan referral number sama buat user yang mendapat reward
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

        // buat point untuk referral yang digunakan
        const point = await prisma.userpoint.create({
          data: {
            userId: authorReferral?.id,
            username: authorReferral?.username,
            expiredDate: dayjs().add(90, 'day').toDate(),
            amount: 0,
          },
        });
        const existingPoints = await prisma.userpoint.findMany({
          where: {
            userId: authorReferral?.id,
          },
          orderBy: {
            amount: 'desc',
          },
        });

        const highestAmount =
          existingPoints.length > 0 ? existingPoints[0].amount : 0;
        const updatedAmount = highestAmount + 10000;

        const today = new Date();
        const oldUserPoints = await prisma.userpoint.findMany({
          where: {
            expiredDate: {
              lt: today,
            },
          },
          orderBy: {
            expiredDate: 'asc',
          },
        });

        // const deletedUserPoints = await prisma.userpoint.deleteMany({
        //   where: {
        //     expiredDate: {
        //       lt: today,
        //     },
        //   },
        // });

        let latestExpiredDate = today;
        if (oldUserPoints.length > 0) {
          latestExpiredDate =
            oldUserPoints[oldUserPoints.length - 1].expiredDate;
        }

        const totalPointsForReferrer = updatedAmount;
        const updatedAuthor = await prisma.userpoint.updateMany({
          where: {
            userId: authorReferral.id,
          },
          data: {
            amount: totalPointsForReferrer,
            expiredDate: latestExpiredDate,
          },
        });

        // buat voucher untuk orang yang menggunakan referral
        const voucher = await prisma.uservoucher.create({
          data: {
            userId: createUser.id,
            username: createUser.username,
            expiredDate: dayjs().add(90, 'day').toDate(),
          },
        });

        // Dapatkan ID dari voucher yang baru saja dibuat
        const voucherId = voucher.id;

        // update user voucher kedalam model userVoucher
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
      success: true,
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

export const selectionRole = async (req: Request, res: Response) => {
  try {
    const { selectedRole } = req.body;

    // Validate the selected role to ensure it is either 'user' or 'eventOrganizer'
    if (!['user', 'eventOrganizer'].includes(selectedRole)) {
      return res.status(400).json({
        code: 400,
        message:
          'Invalid selected role. Please choose either "user" or "eventOrganizer".',
      });
    }

    // Check if the user is authenticated by verifying the token
    const userToken = req.cookies['api-token'];
    if (!userToken) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Login required.',
      });
    }

    // Function to get user ID from the token
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

    // Get user ID from the token
    const userRole = getUserIdFromToken(userToken);
    if (!userRole) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Login required.',
      });
    }

    // Update the user's role in the database
    const updateSelectRole = await prisma.user.update({
      where: {
        id: userRole,
      },
      data: {
        role: selectedRole,
      },
    });

    // Respond with success message and updated user data
    return res.status(200).json({
      code: 200,
      message: 'User role updated successfully',
      data: updateSelectRole,
      success: true,
    });
  } catch (error: any) {
    console.log('@@@ selectionRole error:', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Fail to update role',
    });
  }
};

export const userRole = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid ID params',
      });
    }

    const getUser = await prisma.user.findFirst({
      where: {
        id: parsedId,
      },
    });

    console.log('getUserRoleById Result:', getUser);
    if (!getUser) {
      return res.status(404).json({
        code: 404,
        message: `User with id ${parsedId} not found`,
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: getUser,
      success: true,
    });
  } catch (error: any) {
    console.log('@@@ getEvent error:', error.message || error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};
