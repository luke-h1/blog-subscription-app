import { User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IRequest } from '../types/IRequest';

export const checkAuth = async (
  req: IRequest,
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

    req.user = user;

    next();
  } catch (e) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  return null;
};
