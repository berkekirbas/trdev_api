import { compare, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@/dtos/users.dto';
import UserEntity from '@/entity/users.entity';
import { HttpException } from '@/exceptions/HttpException';
import { Reason, TokenData } from '@/interfaces/auth.interface';
import User from '@/interfaces/users.interface';
import { isEmpty } from '@/utils/isEmpty';
import HttpCodes from '@/utils/HttpCodes';
import JWTService from './jwt.service';
import transporter from '@/utils/mail';
import { generateLink } from '@/utils/generateLink';

@EntityRepository()
class AuthService extends Repository<UserEntity> {
  private jwtService = new JWTService();

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(HttpCodes.BAD_REQUEST, "You're not userData");

    const findUser: User = await UserEntity.findOne({
      where: { email: userData.email },
      select: ['email'],
    });
    if (findUser) throw new HttpException(HttpCodes.CONFLICT, `You're email ${userData.email} already exists`);

    if (userData.password !== userData.passwordConfirm) throw new HttpException(HttpCodes.CONFLICT, 'password_not_matching');

    const hashedPassword = await hash(userData.password, 10);

    const createUserData: User = await UserEntity.create({
      ...userData,
      password: hashedPassword,
    }).save();

    const verificationToken = await this.jwtService.createJwtToken(createUserData.userId, 'mailVerification');

    await UserEntity.update({ userId: createUserData.userId }, { verificationToken: verificationToken.token });

    const link = generateLink('mailVerify', verificationToken.token);

    await this.sendEmail(createUserData.email, link, 'mailVerification');

    delete createUserData.password;
    delete createUserData.verificationToken;
    return createUserData;
  }

  public async login(userData: any): Promise<{ findUser: User; accessToken: TokenData; refreshToken: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(HttpCodes.BAD_REQUEST, "You're not userData");

    const findUser: User = await UserEntity.findOne({
      where: { email: userData.email },
      select: ['userId', 'email', 'name', 'surname', 'password'],
    });
    if (!findUser) throw new HttpException(HttpCodes.CONFLICT, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(HttpCodes.CONFLICT, "You're password not matching");

    const accessToken = await this.jwtService.createJwtToken(findUser.userId, 'access');
    const refreshToken = await this.jwtService.createJwtToken(findUser.userId, 'refresh');

    await UserEntity.update({ userId: findUser.userId }, { isLoggedIn: true });

    delete findUser.password;
    return { findUser, accessToken, refreshToken };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(HttpCodes.BAD_REQUEST, "You're not userData");

    const findUser: User = await UserEntity.findOne({
      where: { email: userData.email },
      select: ['email'],
    });
    if (!findUser) throw new HttpException(HttpCodes.CONFLICT, "You're not user");

    await UserEntity.update({ userId: findUser.userId }, { isLoggedIn: false });

    return findUser;
  }

  // TODO: Refresh token tek kullanımlık olsun, eskisi revoke olmalı
  public async refreshToken(token: string): Promise<{ refreshToken: TokenData; accessToken: TokenData }> {
    if (isEmpty(token)) throw new HttpException(HttpCodes.BAD_REQUEST, 'token_is_empty');

    const userId = await this.jwtService.verifyJwtToken(token, 'refresh');
    const user = await UserEntity.findOne({ where: { userId } });
    if (isEmpty(user)) throw new HttpException(HttpCodes.CONFLICT, 'user_not_found');
    if (!user.isLoggedIn) throw new HttpException(HttpCodes.CONFLICT, 'user_not_logged_in');

    const accessToken = await this.jwtService.createJwtToken(user.userId, 'access');
    const refreshToken = await this.jwtService.createJwtToken(user.userId, 'refresh');

    return { refreshToken, accessToken };
  }

  public async verifyEmail(token: string): Promise<string> {
    const userId = await this.jwtService.verifyJwtToken(token, 'mailVerification');
    const user = await UserEntity.findOne({ where: { userId } });
    if (isEmpty(user)) throw new HttpException(HttpCodes.CONFLICT, 'user_not_found');
    if (user.isVerified) throw new HttpException(HttpCodes.CONFLICT, 'user_already_verified');
    if (user.verificationToken !== token) throw new HttpException(HttpCodes.CONFLICT, 'token_not_matching');

    await UserEntity.update({ userId }, { isVerified: true, verificationToken: null });

    return user.email;
  }

  public async resendVerificationEmail(email: string): Promise<string> {
    const findUser: User = await UserEntity.findOne({ where: { email }, select: ['userId', 'email'] });
    if (isEmpty(findUser)) throw new HttpException(HttpCodes.CONFLICT, `You're email ${email} and account not found`);
    if (findUser.isVerified) throw new HttpException(HttpCodes.CONFLICT, `You're email ${email} already verified`);

    const verificationToken = await this.jwtService.createJwtToken(findUser.userId, 'mailVerification');

    await UserEntity.update({ userId: findUser.userId }, { verificationToken: verificationToken.token });

    const link = generateLink('mailVerify', verificationToken.token);

    await this.sendEmail(findUser.email, link, 'mailVerification');

    return findUser.email;
  }

  public async resetPassword(email: string): Promise<string> {
    const findUser: User = await UserEntity.findOne({ where: { email }, select: ['userId', 'email'] });
    if (isEmpty(findUser)) throw new HttpException(HttpCodes.CONFLICT, `User ${email} not found`);

    const resetToken = await this.jwtService.createJwtToken(findUser.userId, 'resetPassword');

    await UserEntity.update({ userId: findUser.userId }, { resetPasswordToken: resetToken.token });

    const link = generateLink('resetPassword', resetToken.token);

    await this.sendEmail(findUser.email, link, 'resetPassword');

    return findUser.email;
  }

  public async resetPasswordChange(token: string, newPassword: string, newPasswordConfirm: string): Promise<string> {
    const userId = await this.jwtService.verifyJwtToken(token, 'resetPassword');
    const user = await UserEntity.findOne({ where: { userId }, select: ['userId', 'password'] });
    if (isEmpty(user)) throw new HttpException(HttpCodes.CONFLICT, 'user_not_found');
    if (user.resetPasswordToken !== token) throw new HttpException(HttpCodes.CONFLICT, 'token_not_matching');
    if (user.password === (await hash(newPassword, 10))) throw new HttpException(HttpCodes.CONFLICT, 'password_already_used');
    if (newPassword !== newPasswordConfirm) throw new HttpException(HttpCodes.CONFLICT, 'password_not_matching');

    const hashedPassword = await hash(newPassword, 10);

    await UserEntity.update({ userId }, { password: hashedPassword, resetPasswordToken: null });

    return user.email;
  }

  public async resendResetPasswordEmail(email: string): Promise<string> {
    const findUser: User = await UserEntity.findOne({ where: { email }, select: ['userId', 'email'] });
    if (isEmpty(findUser)) throw new HttpException(HttpCodes.CONFLICT, `User ${email} not found`);

    const resetToken = await this.jwtService.createJwtToken(findUser.userId, 'resetPassword');

    await UserEntity.update({ userId: findUser.userId }, { resetPasswordToken: resetToken.token });

    const link = generateLink('resetPassword', resetToken.token);

    await this.sendEmail(findUser.email, link, 'resetPassword');

    return findUser.email;
  }

  public async sendEmail(email: string, link: string, reason: Reason): Promise<void> {
    let mailReason = null;
    let html = null;

    switch (reason) {
      case 'mailVerification':
        mailReason = 'Mail verification';
        html = `
        <h1>You have requested a verify your email</h1>
        <p>Please go to this link to verify your email </p>
        <a href=${link} clicktracking=off>${link}</a>
        `;
        break;
      case 'resetPassword':
        mailReason = 'Reset password';
        html = `
        <h1>You have requested reset your password</h1>
        <p>Please go to this link to verify your email</p>
        <a href=${link} clicktracking=off>${link}</a>
        `;
        break;
      default:
        throw new HttpException(HttpCodes.CONFLICT, 'reason_not_valid');
    }

    await transporter.sendMail({
      to: email,
      subject: mailReason,
      html: html,
    });
  }
}

export default AuthService;
