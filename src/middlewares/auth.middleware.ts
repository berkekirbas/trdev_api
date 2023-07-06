import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import UserEntity from '@/entity/users.entity';
import { HttpException } from '@/exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@/interfaces/auth.interface';
import HttpCodes from '@/utils/HttpCodes';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['access'] || (req.header('access') ? req.header('access').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const { id } = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const findUser = await UserEntity.findOne(id, {
        select: ['userId', 'email', 'name', 'surname'],
      });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(HttpCodes.UNAUTHORIZED, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(HttpCodes.NOT_FOUND, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(HttpCodes.UNAUTHORIZED, 'Wrong authentication token'));
  }
};

export default authMiddleware;
