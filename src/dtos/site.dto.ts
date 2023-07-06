import { IsString } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  public siteName: string;

  @IsString()
  public siteUrl: string;

  @IsString()
  public siteDescription: string;
}
