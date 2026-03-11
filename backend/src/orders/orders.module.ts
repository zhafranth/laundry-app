import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService, OutletAccessGuard],
  exports: [OrdersService],
})
export class OrdersModule {}
