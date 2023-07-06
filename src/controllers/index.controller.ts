import HttpCodes from '@/utils/HttpCodes';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendStatus(HttpCodes.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
