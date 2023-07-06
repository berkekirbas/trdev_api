import { Router } from 'express';

// Controllers
import AuthController from '@/controllers/auth.controller';

// DTOs
import { CreateUserDto, EmailResendDto, LoginUserDto, ResetPasswordChangeDto, ResetPasswordDto } from '@/dtos/users.dto';

// Interfaces
import Routes from '@/interfaces/routes.interface';

// Middlewares
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);

    this.router.post(`${this.path}/refresh`, this.authController.refreshToken);

    this.router.get(`${this.path}/verify/email/:token`, this.authController.verifyEmail);
    this.router.post(`${this.path}/verify/email/resend`, validationMiddleware(EmailResendDto, 'body'), this.authController.resendVerificationEmail);

    this.router.post(`${this.path}/reset/password/`, validationMiddleware(ResetPasswordDto, 'body'), this.authController.resetPassword);
    this.router.post(
      `${this.path}/reset/password/change/:token`,
      validationMiddleware(ResetPasswordChangeDto, 'body'),
      this.authController.resetPasswordChange,
    );

    this.router.post(`${this.path}/reset/password/resend`, validationMiddleware(EmailResendDto), this.authController.resendResetPasswordEmail);
  }
}

export default AuthRoute;
