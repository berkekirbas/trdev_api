import { APP_URL, PORT } from '@/config';

import { HttpException } from '@/exceptions/HttpException';

import HttpCodes from './HttpCodes';

export function generateLink(reason: Reason['reason'], token: string): string {
  if (reason === 'mailVerify') {
    return `${APP_URL}:${PORT}/auth/verify/email/${token}`;
  } else if (reason === 'resetPassword') {
    return `${APP_URL}:${PORT}/auth/reset/password/change/${token}`;
  } else {
    throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not provide an reason');
  }
}

interface Reason {
  reason: 'mailVerify' | 'resetPassword';
}
