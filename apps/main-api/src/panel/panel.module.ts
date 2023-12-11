import { Module } from '@nestjs/common';
import { PanelService } from './panel.service';
import { PanelController } from './panel.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PanelController],
  providers: [PanelService, PrismaService],
})
export class PanelModule {}
