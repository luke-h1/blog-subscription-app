import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // eslint-disable-next-line prefer-destructuring
  token = token.split(' ')[1];

  try {
    const user = (await jwt.verify(token, process.env.JWT_SECRET)) as User;

    const maybeAdminUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (maybeAdminUser?.Role === 'ADMIN') {
      req.user = user.email;
      next();
    } else {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (e) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  return null;
};
