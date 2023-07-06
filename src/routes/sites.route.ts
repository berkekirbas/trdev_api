import { Router } from 'express';
import Routes from '@/interfaces/routes.interface';

import SitesController from '@/controllers/sites.controller';

import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';

import { CreateSiteDto } from '@/dtos/site.dto';

class SitesRoute implements Routes {
  public path = '/sites';
  public router = Router();
  public sitesController = new SitesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.sitesController.getSites);
    this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateSiteDto, 'body'), this.sitesController.createSite);
    this.router.get(`${this.path}/:siteId`, authMiddleware, this.sitesController.getSite);
    this.router.patch(`${this.path}/update/:siteId`, authMiddleware, this.sitesController.updateSite);
    this.router.delete(`${this.path}/delete/:siteId`, authMiddleware, this.sitesController.deleteSite);
  }
}

export default SitesRoute;
