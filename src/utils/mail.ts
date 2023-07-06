import nodemailer from 'nodemailer';
import { IS_MAIL_SECURE_PROTOCOL, MAIL_FROM, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER, NODE_ENV } from '@/config';
import { logger } from './logger';

let transporter = null;

if (NODE_ENV === 'production') {
  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: Boolean(IS_MAIL_SECURE_PROTOCOL),
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
    from: MAIL_FROM,
  });
} else {
  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    //secure: Boolean(IS_MAIL_SECURE_PROTOCOL),
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
    from: MAIL_FROM,
  });
}

transporter.on('error', error => {
  logger.error(error);
});

transporter.on('idle', () => {
  transporter.close();
});

export default transporter;
