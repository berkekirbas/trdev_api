import { Request, Response, NextFunction } from 'express';

import redisClient from '@/utils/redis';
import HttpStatusCode from '@/utils/HttpCodes';
import { RATE_LIMITING_REQUEST_LIMIT, RATE_LIMITING_SECOND_LIMIT } from '@/config';
import { HttpException } from '@/exceptions/HttpException';

async function rateLimiter(request: Request, response: Response, next: NextFunction) {
  const ip: any = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  const redisResponse: any = await redisClient.multi().incr(ip).expire(ip, Number(RATE_LIMITING_SECOND_LIMIT)).exec();

  if (redisResponse[0] > Number(RATE_LIMITING_REQUEST_LIMIT)) {
    return next(new HttpException(HttpStatusCode.TOO_MANY_REQUESTS, 'Too many requests, please try again later'));
  } else {
    next();
  }
}

export default rateLimiter;
