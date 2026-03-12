import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { OutletAccessGuard } from './guards/outlet-access.guard';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, OutletAccessGuard],
  exports: [NotificationsService],
})
export class NotificationsModule {}
