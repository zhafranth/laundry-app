import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [StaffService, OutletAccessGuard],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
