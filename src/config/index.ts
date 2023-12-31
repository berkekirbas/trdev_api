import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  SECRET_KEY_EXPIRES,
  REFRESH_SECRET_KEY,
  REFRESH_SECRET_KEY_EXPIRES,
  ORIGIN,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  HTTPS_ENABLED,
  REDIS_HOST,
  REDIS_PORT,
  LOG_FORMAT,
  LOG_DIR,
  RATE_LIMITING_SECOND_LIMIT,
  RATE_LIMITING_REQUEST_LIMIT,
  MAIL_POOL,
  MAIL_HOST,
  MAIL_PORT,
  IS_MAIL_SECURE_PROTOCOL,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_FROM,
  APP_URL,
  VERIFICATION_SECRET_KEY,
  VERIFICATION_SECRET_KEY_EXPIRES,
  RESET_PASSWORD_SECRET_KEY,
  RESET_PASSWORD_SECRET_KEY_EXPIRES,
} = process.env;
