import { Module } from '@nestjs/common';
import { AdsRequestService } from './ads-request.service';
import { AdsRequestController } from './ads-request.controller';

@Module({
  controllers: [AdsRequestController],
  providers: [AdsRequestService]
})
export class AdsRequestModule {}
