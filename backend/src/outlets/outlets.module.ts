import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OutletOwnerGuard } from './guards/outlet-owner.guard';
import { OutletsController } from './outlets.controller';
import { OutletsService } from './outlets.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [OutletsService, OutletOwnerGuard],
  controllers: [OutletsController],
  exports: [OutletsService],
})
export class OutletsModule {}
