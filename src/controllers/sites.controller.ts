import { NextFunction, Response } from 'express';

// Services
import SitesService from '@/services/sites.service';

// Interfaces
import ISite from '@/interfaces/sites.interface';
import User from '@/interfaces/users.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';

// Utils
import HttpCodes from '@/utils/HttpCodes';

class IndexController {
  public sitesService = new SitesService();

  public getSites = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: User['userId'] = req.user.userId;
      const sites: ISite = await this.sitesService.getSites(userId);

      res.status(HttpCodes.OK).json({ data: sites, message: 'user_sites_get' });
    } catch (error) {
      next(error);
    }
  };

  public getSite = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: User['userId'] = req.user.userId;
      const siteId: ISite['siteId'] = req.params.siteId;
      const site: ISite = await this.sitesService.getSite(userId, siteId);

      res.status(HttpCodes.OK).json({ data: site, message: 'user_site_get' });
    } catch (error) {
      next(error);
    }
  };

  public createSite = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: User['userId'] = req.user.userId;
      const createdSite: ISite = await this.sitesService.createSite(userId, req.body);

      res.status(HttpCodes.OK).json({ data: createdSite, message: 'user_site_creation' });
    } catch (error) {
      next(error);
    }
  };

  public updateSite = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: User['userId'] = req.user.userId;
      const siteId: ISite['siteId'] = req.params.siteId;
      const updatedSite: ISite = await this.sitesService.updateSite(userId, siteId, req.body);

      res.status(HttpCodes.OK).json({ data: updatedSite, message: 'user_site_update' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSite = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: User['userId'] = req.user.userId;
      const siteId: ISite['siteId'] = req.params.siteId;
      const deletedSite: ISite = await this.sitesService.deleteSite(userId, siteId);

      res.status(HttpCodes.OK).json({ data: deletedSite, message: 'user_site_delete' });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
