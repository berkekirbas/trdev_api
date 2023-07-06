import ISites from '@/interfaces/sites.interface';
export default interface User {
  userId: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  isVerified: boolean;
  sites: ISites[];
  verificationToken: string;
  resetPasswordToken: string;
  isLoggedIn: boolean;
}
