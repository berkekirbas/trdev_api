import { createClient } from 'redis';

import { redisConfig } from '@/config/databases.config';
import { logger } from './logger';

const redisClient = createClient({ url: `${redisConfig.host}:${redisConfig.port}` });

redisClient.on('ready', () => {
  logger.info('Redis is connected');
});

redisClient.on('error', error => {
  logger.error('Error ' + error);
});

export default redisClient;
