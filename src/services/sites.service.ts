import { EntityRepository, Repository } from 'typeorm';

// Entities
import SitesEntity from '@/entity/sites.entity';

// Exceptions
import { HttpException } from '@/exceptions/HttpException';

// Interfaces
import User from '@/interfaces/users.interface';
import ISite from '@/interfaces/sites.interface';

// Utils
import { isEmpty } from '@/utils/isEmpty';
import HttpCodes from '@/utils/HttpCodes';

@EntityRepository()
class SitesService extends Repository<SitesEntity> {
  public async getSites(userId: User['userId']): Promise<ISite> {
    if (isEmpty(userId)) throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not send correct userId');

    const findedSites: any = await SitesEntity.find({ where: { user: userId }, relations: ['user'] });

    if (!findedSites || isEmpty(findedSites)) throw new HttpException(HttpCodes.NOT_FOUND, 'You don`t have a site');

    return findedSites;
  }

  public getSite = async (user: User['userId'], siteId: ISite['siteId']): Promise<ISite> => {
    if (isEmpty(user)) throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not send correct userId');

    const findedSite: ISite = await SitesEntity.findOne({
      where: { siteId, user },
    });
    if (!findedSite) throw new HttpException(HttpCodes.NOT_FOUND, 'You don`t have a site');

    return findedSite;
  };

  public async createSite(userId: User['userId'], siteData: ISite): Promise<ISite> {
    if (isEmpty(userId)) throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not send correct userId');

    const findedSite: ISite = await SitesEntity.findOne({
      where: { siteUrl: siteData.siteUrl },
    });
    if (findedSite) throw new HttpException(HttpCodes.CONFLICT, `You're site ${siteData.siteUrl} already exists`);
    const createdSite: ISite = await SitesEntity.create({
      ...siteData,
      user: userId,
    }).save();
    return createdSite;
  }

  public async updateSite(userId: User['userId'], siteId: ISite['siteId'], siteData: ISite): Promise<ISite> {
    if (isEmpty(userId)) throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not send correct userId');

    const findedSite: ISite = await SitesEntity.findOne({
      where: { siteId, user: userId },
    });
    if (!findedSite) throw new HttpException(HttpCodes.NOT_FOUND, 'You dont have a site');
    if (
      findedSite.siteUrl !== siteData.siteUrl ||
      findedSite.siteName !== siteData.siteName ||
      findedSite.siteDescription !== siteData.siteDescription
    ) {
      await SitesEntity.update({ siteId, user: userId }, { ...siteData });
      return siteData;
    }
    throw new HttpException(HttpCodes.CONFLICT, `You're site info look like is the same as before`);
  }

  public async deleteSite(userId: User['userId'], siteId: ISite['siteId']): Promise<ISite> {
    if (isEmpty(userId)) throw new HttpException(HttpCodes.BAD_REQUEST, 'You`re not send correct userId');

    const findedSite: ISite = await SitesEntity.findOne({
      where: { siteId, user: userId },
    });
    if (!findedSite) throw new HttpException(HttpCodes.NOT_FOUND, 'You dont have a site');

    await SitesEntity.delete({ siteId, user: userId });
    return findedSite;
  }
}

export default SitesService;
