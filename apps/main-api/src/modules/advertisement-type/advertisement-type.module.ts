import { Module } from '@nestjs/common';
import { AdvertisementTypeService } from './advertisement-type.service';
import { AdvertisementTypeController } from './advertisement-type.controller';

@Module({
  controllers: [AdvertisementTypeController],
  providers: [AdvertisementTypeService],
})
export class AdvertisementTypeModule {}
