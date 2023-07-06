import { Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Interfaces
import ISite from '@/interfaces/sites.interface';
import User from '@/entity/users.entity';

@Entity()
export default class Sites extends BaseEntity implements ISite {
  @PrimaryGeneratedColumn('uuid')
  public siteId: string;

  @Column()
  public siteName: string;

  @Column()
  public siteUrl: string;

  @Column()
  public siteDescription: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column()
  @CreateDateColumn({ select: false })
  public createdAt: Date;

  @Column()
  @UpdateDateColumn({ select: false })
  public updatedAt: Date;

  @ManyToOne(() => User, user => user.userId)
  public user: User['userId'];
}
