import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import { createConnection } from 'typeorm';

// config
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS, LOG_FORMAT } from '@config';

// interfaces
import Routes from '@/interfaces/routes.interface';

// configs
import { postgresConfig } from '@/config/databases.config';

// middlewares
import errorMiddleware from '@/middlewares/error.middleware';
import rateLimiter from '@/middlewares/rateLimiter.middleware';

// utils
import { logger, stream } from '@utils/logger';
import HttpCodes from '@/utils/HttpCodes';
import redisClient from '@/utils/redis';

// FIXME: Refresh Token sistemindeki olan 1-2 sorunu düzelt.
// TODO: Write tests for all routes - en son

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  public async connectToDB(): Promise<void> {
    await createConnection(postgresConfig).then(() => {
      logger.info('Connected to Postgres');
    });
    await redisClient.connect();
  }

  private initializeMiddlewares() {
    //this.app.use('trust proxy');
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.disable('x-powered-by');
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', rateLimiter, route.router);
    });

    /**
     * If no route is matched by now, it must be a 404
     */
    this.app.use('*', function (_req, res) {
      res.status(HttpCodes.NOT_FOUND).json({ message: 'route_not_found' });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
