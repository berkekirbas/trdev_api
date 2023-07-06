/* eslint-disable no-var */
import { verify, sign } from 'jsonwebtoken';

import User from '@/interfaces/users.interface';
import { DataStoredInToken, Reason, TokenData } from '@/interfaces/auth.interface';

import {
  REFRESH_SECRET_KEY,
  REFRESH_SECRET_KEY_EXPIRES,
  RESET_PASSWORD_SECRET_KEY,
  RESET_PASSWORD_SECRET_KEY_EXPIRES,
  SECRET_KEY,
  SECRET_KEY_EXPIRES,
  VERIFICATION_SECRET_KEY,
  VERIFICATION_SECRET_KEY_EXPIRES,
} from '@/config';

import { HttpException } from '@/exceptions/HttpException';

import HttpCodes from '@/utils/HttpCodes';

class JWTService {
  public async createJwtToken(userId: User['userId'], reason: Reason): Promise<TokenData> {
    const id = userId;
    var secret: string = null;
    let expiresIn = null;

    switch (reason) {
      case 'access':
        secret = SECRET_KEY;
        expiresIn = Number(SECRET_KEY_EXPIRES) * 1000;
        break;
      case 'refresh':
        secret = REFRESH_SECRET_KEY;
        expiresIn = Number(REFRESH_SECRET_KEY_EXPIRES) * 1000;
        break;
      case 'mailVerification':
        secret = VERIFICATION_SECRET_KEY;
        expiresIn = Number(VERIFICATION_SECRET_KEY_EXPIRES) * 1000;
        break;
      case 'resetPassword':
        secret = RESET_PASSWORD_SECRET_KEY;
        expiresIn = Number(RESET_PASSWORD_SECRET_KEY_EXPIRES) * 1000;
        break;
      default:
        throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not provide an reason');
    }

    const token = sign({ id }, secret, { expiresIn });

    return { token, expiresIn };
  }

  public async verifyJwtToken(token: string, reason: Reason): Promise<User['userId']> {
    const userToken = token;
    let secret: string = null;

    switch (reason) {
      case 'access':
        secret = SECRET_KEY;
        break;
      case 'refresh':
        secret = REFRESH_SECRET_KEY;
        break;
      case 'mailVerification':
        secret = VERIFICATION_SECRET_KEY;
        break;
      case 'resetPassword':
        secret = RESET_PASSWORD_SECRET_KEY;
        break;
      default:
        throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not provide an reason');
    }

    const { id } = verify(userToken, secret) as DataStoredInToken;

    return id;
  }
}

export default JWTService;
