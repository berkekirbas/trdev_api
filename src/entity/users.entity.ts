import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import User from '@/interfaces/users.interface';
import Sites from '@/entity/sites.entity';

@Entity()
export default class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  public userId: string;

  @Column({ select: false })
  @IsNotEmpty()
  @Unique(['email'])
  public email: string;

  @Column()
  @IsNotEmpty()
  public name: string;

  @Column()
  @IsNotEmpty()
  public surname: string;

  @Column({ select: false })
  @IsNotEmpty()
  public password: string;

  @Column()
  @CreateDateColumn({ select: false })
  public createdAt: Date;

  @Column()
  @UpdateDateColumn({ select: false })
  public updatedAt: Date;

  @OneToMany(() => Sites, site => site.user)
  public sites: Sites[];

  @Column({ default: false })
  public isVerified: boolean;

  @Column({ default: null })
  public verificationToken: string;

  @Column({ default: null })
  public resetPasswordToken: string;

  @Column({ default: false })
  public isLoggedIn: boolean;
}
