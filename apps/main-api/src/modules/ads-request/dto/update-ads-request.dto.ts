import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdsRequestStatus } from '../../../constants/ads_request';

export class UpdateAdsRequestDto {
  @IsEnum(AdsRequestStatus)
  @IsOptional()
  readonly status?: AdsRequestStatus;
}
