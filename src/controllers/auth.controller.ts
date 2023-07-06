import User from './../interfaces/users.interface';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from '@/dtos/users.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import AuthService from '@/services/auth.service';
import HttpCodes from '@/utils/HttpCodes';
import { NODE_ENV } from '@/config';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(HttpCodes.CREATED).json({ data: signUpUserData, message: 'user_signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const { findUser, accessToken, refreshToken } = await this.authService.login({
        email: userData.email,
        password: userData.password,
      });

      res.cookie('access', accessToken.token, {
        maxAge: accessToken.expiresIn,
        httpOnly: true,
        secure: NODE_ENV === 'production',
      });

      res.status(HttpCodes.OK).json({ data: findUser, refresh: refreshToken.token, message: 'user_login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.clearCookie('access');
      res.status(HttpCodes.OK).json({ data: logOutUserData, message: 'user_logout' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers['x-refresh-token'] as string;
      const { refreshToken, accessToken } = await this.authService.refreshToken(token);
      res.cookie('access', accessToken.token, {
        maxAge: accessToken.expiresIn,
        httpOnly: true,
        secure: NODE_ENV === 'production',
      });

      res.status(HttpCodes.OK).json({ refreshToken: refreshToken.token, message: 'token_refreshed' });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.params['token'] as string;
      const email: string = await this.authService.verifyEmail(token);
      res.status(HttpCodes.OK).json({ data: email, message: 'email_verified' });
    } catch (error) {
      next(error);
    }
  };

  public resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email: string = req.body['email'] as string;
      const findedEmail: User['email'] = await this.authService.resendVerificationEmail(email);
      res.status(HttpCodes.OK).json({ data: findedEmail, message: 'email_resent' });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email: string = req.body['email'] as string;
      const findedEmail: User['email'] = await this.authService.resetPassword(email);
      res.status(HttpCodes.OK).json({ data: findedEmail, message: 'password_reset' });
    } catch (error) {
      next(error);
    }
  };

  public resetPasswordChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.params['token'] as string;

      const password: string = req.body['password'] as string;

      const passwordConfirm: string = req.body['passwordConfirm'] as string;

      const email: string = await this.authService.resetPasswordChange(token, password, passwordConfirm);

      res.status(HttpCodes.OK).json({ data: email, message: 'password_changed' });
    } catch (error) {
      next(error);
    }
  };

  public resendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email: string = req.body['email'] as string;
      const findedEmail: User['email'] = await this.authService.resendResetPasswordEmail(email);
      res.status(HttpCodes.OK).json({ data: findedEmail, message: 'email_resent' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
