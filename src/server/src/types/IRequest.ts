import { User } from '@prisma/client';
import { Request } from 'express';

export interface IRequest extends Request {
  user: User;
}
