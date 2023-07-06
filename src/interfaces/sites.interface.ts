import User from './users.interface';

export default interface ISite {
  siteId: string;
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  isActive: boolean;
  user: User['userId'];
}
